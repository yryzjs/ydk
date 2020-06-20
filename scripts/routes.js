//@ts-check
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const myEnv = dotenv.config()
const prettier = require(path.resolve('./node_modules/prettier'))
const rootpath = path.resolve('./src/pages')
const publicUrl = myEnv.parsed.PUBLIC_URL || ''
// console.warn('publicUrl', publicUrl, myEnv.parsed)

/**
 * @param {string} s
 */
function toUrl(s) {
  let urlPart = s.split('/')
  urlPart = urlPart.map((u) =>
    u.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '-' + y.toLowerCase()).replace(/^-/, ''),
  )
  return urlPart.join('/')
}
/**
 * @param {string} str
 */
function toUpperCamelCase(str) {
  return str.replace(/[-_/\\](\w)/g, (a, b) => b.toUpperCase())
}
/**
 * @type {string[]}
 */
const routes = []
/**
 * @type {string[]}
 */
const imports = []
/**
 * @param {string} dir
 */
function readDir(dir) {
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    if (fileName === 'components' || fileName.startsWith('_')) {
      continue
    }

    const pagePath = path.join(dir, fileName)
    if (fs.lstatSync(pagePath).isDirectory()) {
      readDir(pagePath)
    } else {
      if (!fileName.endsWith('.jsx') && !fileName.endsWith('.tsx')) {
        continue
      }
      let pageImport = pagePath
        .substring(rootpath.length, pagePath.length - 4)
        .replace(/\\/g, '/')
      let pageName = toUpperCamelCase(pageImport)
      imports.push(`import ${pageName} from '../pages${pageImport}'`)
      // console.warn('pageImport', pageImport, toUrl(pageImport.substr(1)))

      routes.push(`'${publicUrl}/${toUrl(pageImport.substr(1))}':${pageName}`)
    }
  }
}
readDir(rootpath)
let fileContent = `${imports.join('\n')}\nconst routes= {${routes.join(',\n')}}`
fileContent += '\nexport type RouteKey =keyof typeof routes\nexport default routes'
let options = prettier.resolveConfig.sync(path.resolve('prettier.config.js'))
fileContent = prettier.format(fileContent, {...options, parser: 'typescript'})
fs.writeFileSync(path.join(rootpath, '../config/routes.ts'), fileContent, 'utf8')
