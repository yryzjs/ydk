const path = require('path')
const fs = require('fs')
const axios = require(path.resolve('./node_modules/axios'))

/**
 * @param {string} str
 */
function toLowerCamelCase(str) {
  str = toUpperCamelCase(str)
  return str[0].toLowerCase() + str.substr(1)
}
/**
 * @param {string} str
 */
function toUpperCamelCase(str) {
  return str.replace(/[-_](\w)/g, (a, b) => b.toUpperCase())
}
/**
 * @param {string} str
 */
function normalType(str) {
  str = str.replace('#/definitions/', '').replace(/«/g, '<').replace(/»/g, '>')
  // str = str.replace(/[^List|<List]<([^>]*)>/g, (a, b) => b + '[]')
  return str
}

class ApiCodeGenerator {
  constructor(config) {
    this.config = config
    this.apiDocs = {}
    this.apiClasses = {}
    this.typeDefinition = {}
  }
  async codegen() {
    let {name, url, codegenType} = this.config
    console.log('start codegen ', name, url)
    let res = await axios.get(url)
    this.apiDocs = res.data
    let {paths} = this.apiDocs
    for (let path in paths) {
      this.parsePath(path, paths[path])
    }

    let CodeGen = require(`./apigen.${codegenType}.js`)
    let codegen = new CodeGen(
      this.apiClasses,
      this.typeDefinition,
      this.config,
      this.apiDocs,
    )
    let fileContent = codegen.codegen()
    const apiDir = path.join(process.cwd(), this.config.outputDir)
    fs.writeFileSync(
      path.join(apiDir, this.config.name + `.${codegenType}`),
      fileContent,
      'utf8',
    )
  }
  parsePath(path, pathInfo) {
    let pathParts = path.split('/').slice(this.config.pathSplitIndex)
    pathParts = pathParts.filter((p) => p[0] !== '{')
    for (let httpMethod in pathInfo) {
      let {parameters = [], responses, produces, operationId} = pathInfo[httpMethod]
      if (Array.isArray(produces) && produces[0] === 'application/octet-stream') continue
      // operationId = operationId.substr(0, operationId.indexOf('Using'))
      let apiMethod = this.apiClasses
      let methodParts = [...pathParts, httpMethod]
      for (let i = 0; i < methodParts.length; i++) {
        let pathPart = methodParts[i]
        if (pathPart === 'pb') continue
        let name = toLowerCamelCase(pathPart)
        if (!apiMethod[name]) {
          apiMethod[name] = {}
        }
        apiMethod = apiMethod[name]
      }

      if (!apiMethod) throw new Error(`无法生成api class`)
      if (apiMethod.path) {
        // console.warn(this.apiClasses)
        // console.warn(this.typeDefinition)

        throw new Error('同名的方法签名' + path + ' ' + apiMethod.path)
      }
      let responseType = this.getType(responses[200].schema)
      let params = {}
      for (let p of parameters) {
        let {in: paramIn, name} = p
        if (paramIn === 'header' || paramIn === 'formData') {
          continue
        }
        try {
          let type = this.getType(p)
          params[name] = {...p, type}
        } catch (ex) {
          ex.message = path + '\n' + ex.message
          throw ex
        }
      }
      Object.assign(apiMethod, {
        ...pathInfo[httpMethod],
        httpMethod,
        responseType,
        path,
        params,
      })
    }
  }

  getType(property) {
    let {type, $ref, format, schema} = property
    if (schema) return this.getType(schema)
    if ($ref) return this.getRefType($ref)
    switch (type) {
      case 'integer':
      case 'number':
      case 'long':
      case 'int64':
      case 'int':
        return 'number'
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
      case 'list':
      case 'array':
        let refType = this.getType(property.items)
        return `${refType}[]`
      case 'object':
        if (property.additionalProperties) return 'any'
        throw new Error(`无法识别的object类型${JSON.stringify(property)}`)
      default:
        throw new Error(`无法识别的属性类型 ${type} ${JSON.stringify(property)}`)
    }
  }

  checkRefType(name, definition) {
    if (this.typeDefinition[name]) return
    let genericName = ''
    if (name.includes('<')) {
      genericName = name
        .substring(name.indexOf('<') + 1, name.lastIndexOf('>'))
        .replace('[', '')
        .replace(']', '')
    }
    let finalName = name.replace(/<.*>$/, '<T>').replace('[', '').replace(']', '')
    let properties = {}
    let typeDefinition = {
      description: definition.description,
      properties,
      name: finalName,
    }

    //先插入 防止递归引用类型
    this.typeDefinition[finalName] = typeDefinition
    let required = definition.required || []
    for (let propName in definition.properties) {
      let property = definition.properties[propName]
      try {
        let tsType = this.getType(property)
        if (tsType === genericName || tsType === genericName + '[]') {
          tsType = tsType.replace(genericName, 'T')
        }
        let {description = '', example = ''} = property
        description = `${description}${
          example ? ' example:' + example.toString().replace(/\*/g, '') : ''
        }`
        properties[propName] = {
          name,
          required: required.includes(propName),
          type: tsType,
          description,
        }
      } catch (ex) {
        console.error(ex)
        throw new Error(`无法识别类型${propName} property:${JSON.stringify(property)}`)
      }
    }
  }

  getRefType(refType) {
    let finalRefType = normalType(refType)
    let hasIgnore = this.config.ignoreTypes.some(
      (ignore) => ignore === finalRefType || finalRefType.startsWith(ignore + '<'),
    )
    if (hasIgnore) return finalRefType
    let definition = this.apiDocs.definitions[refType.replace('#/definitions/', '')]

    this.checkRefType(finalRefType, definition)
    return finalRefType
    //   if(finalRefType.includes('<')){
    //     return this.getGenericsType(finalRefType,definition)
    //   }
    //   if (this.typeDefinition[finalRefType]){

    //     return this.typeDefinition[finalRefType].name
    //   }
    //   if (definition) {
    //     this.addTypeDefinition(finalRefType, definition)
    //   }  else {
    //     throw new Error('invalidate types:' + refType)
    //   }
    //   if(!this.typeDefinition[finalRefType]){
    //     console.warn(finalRefType, this.typeDefinition)
    //   }
    //   return this.typeDefinition[finalRefType].name
  }
}

let defaultConfig = {
  mapTypes: {Timestamp: 'number', Int64: 'string'},
  codegenType: 'ts',
  pathSplitIndex: 2,
  outputDir: 'src/api',
  ignoreTypes: ['DynamicQuery', 'PageList', 'PageRequest'],
}
let config = require(path.resolve('api.config.js'))
let {apis = [], ...restConfig} = {...defaultConfig, ...config}

apis.forEach((api) => {
  let apiCodegen = new ApiCodeGenerator({...restConfig, ...api})
  apiCodegen.codegen()
})
