const path = require('path')
const prettier = require(path.resolve('./node_modules/prettier'))
const httpMethods = ['get', 'post', 'put', 'delete']
function toClassCase(str) {
  return str[0].toUpperCase() + str.substr(1)
}

class TsCodegen {
  constructor(apiClasses, typeDefinition, config, apiDoc) {
    // console.warn(apiDoc)

    this.config = config
    this.apiDocs = apiDoc
    this.apiClasses = apiClasses
    this.typeDefinition = typeDefinition
  }
  codegen() {
    let {apiClasses, typeDefinition, config} = this
    let tsContent = [`import {httpGet,httpPost,httpDelete} from 'ydk-web/services'\n`]
    // tsContent.push('declare type long = number')
    // tsContent.push('declare type int = number')
    let definitionNames = Object.keys(typeDefinition).sort()

    // 生成ts类型
    for (let definitionName of definitionNames) {
      let typeInfo = typeDefinition[definitionName]
      let typeName = typeInfo.name

      // if (typeName.startsWith(config.responseWarp)) continue
      //排除Map定义
      if (typeInfo.typeName === 'Map<T>') continue
      if (config.ignoreTypes.some((i) => i === typeName)) continue
      if (typeInfo.description) {
        tsContent.push(`/** ${typeInfo.description} */`)
      }
      tsContent.push(`export interface ${typeName} {`)
      for (let propertyName in typeInfo.properties) {
        let property = typeInfo.properties[propertyName]
        if (property.description && property.description.trim() !== propertyName) {
          tsContent.push(`/** ${property.description} */`)
        }
        // console.warn('property.type', property.type, normalType(property.type))

        tsContent.push(`${propertyName}${property.required ? '' : '?'}: ${property.type}`)
      }

      tsContent.push('}\n')
    }
    //生成api
    let apiContent = []

    // apiContent.push(`let baseUrl='${config.url.match(/(http:\/\/[^\/]*)/)[0]}'`)
    apiContent.push('export default {')
    let classNames = Object.keys(apiClasses)

    if (classNames.length === 1) {
      this.generateApi(apiContent, apiClasses[classNames[0]])
    } else {
      this.generateApi(apiContent, apiClasses)
    }
    apiContent.push('}')

    let fileContent = tsContent.join('\n') + apiContent.join('\n')
    let options = prettier.resolveConfig.sync(
      path.join(process.cwd(), 'prettier.config.js'),
    )
    fileContent = prettier.format(fileContent, {...options, parser: 'typescript'})
    return fileContent
  }
  generateApi(arr, allclasss) {
    for (let className in allclasss) {
      let apiClass = allclasss[className]
      if (apiClass.params && apiClass.responseType) {
        this.generateClass(arr, apiClass, className)
      } else {
        let keys = Object.keys(apiClass)
        if (keys.length === 1 && httpMethods.includes(keys[0])) {
          let apiCls = apiClass[keys[0]]
          // console.warn(keys[0], className, apiCls)

          this.generateClass(arr, apiCls, className)
        } else {
          arr.push(`${className}: {`)
          this.generateApi(arr, apiClass)
          arr.push(`},`)
        }
      }
    }
  }
  generateClass(arr, apiClass, methodName) {
    let {config} = this

    let {path, httpMethod, responseType, summary, params} = apiClass

    let queryParamArr = []
    let bodyParamArr = []
    let pathParams = []
    for (let paramName in params) {
      let param = params[paramName]
      if (param.in === 'path') {
        let pathStr = ''
        if (param.description && paramName !== param.description) {
          pathStr += `/** ${param.description} */\n`
        }
        pathStr += `${paramName}${param.required ? '' : '?'}: ${param.type}`
        pathParams.push(pathStr)
      } else if (param.in === 'query') {
        let queryStr = ''

        if (param.description && paramName !== param.description) {
          queryStr += `/** ${param.description} */`
        }
        queryStr += `${paramName}${param.required ? '' : '?'}: ${param.type},`
        queryParamArr.push(queryStr)
      } else if (param.in === 'body') {
        if (bodyParamArr.length > 0) {
          console.error('不能同时存在两个body', path)
          continue
        }

        bodyParamArr.push(`data${param.required ? '' : '?'}: ${param.type}`)
      }
    }
    if (summary && methodName !== summary) {
      arr.push(`/**`)
      arr.push(`*${summary}`)
      arr.push(`*/`)
    }
    let methodStr = `${methodName}(`
    let paramArrs = []

    if (queryParamArr.length > 0) {
      let queryParamsPart = `params:{${queryParamArr.join('\n')}}`
      paramArrs.push(queryParamsPart)
    }
    if (bodyParamArr.length > 0) {
      paramArrs.push(bodyParamArr.join(''))
    }
    if (pathParams.length > 0) {
      paramArrs = paramArrs.concat(pathParams)
    }

    methodStr += paramArrs.join(',') + ')'

    if (responseType.startsWith(config.responseWarp)) {
      const rgResponseWarp = new RegExp(`^${config.responseWarp}<(.*)>`)
      responseType = responseType.replace(rgResponseWarp, (a, b) => b)
    }
    //<${responseType}>
    methodStr += `: Promise<${responseType}> {`
    methodStr += `const path = \`${path.replace(/\{/g, '${')}\`\n`
    methodStr += `return http${toClassCase(httpMethod)}(path`
    if (bodyParamArr.length > 0) {
      methodStr += ',data'
    } else if (queryParamArr.length > 0 && httpMethod != 'get') {
      methodStr += ',null'
    }

    if (queryParamArr.length > 0) {
      methodStr += ',{params}'
    } else {
      methodStr += ''
    }
    // methodStr += ').then(res => res.data.data'
    // if (config.responseWarp) {
    //   methodStr += '.data'
    // }
    methodStr += ')},'
    arr.push(methodStr)
  }
}

module.exports = TsCodegen
