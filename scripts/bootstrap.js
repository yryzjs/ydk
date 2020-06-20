const {existsSync, writeFileSync} = require('fs')
const {join} = require('path')
const getPackages = require('./utils/getPackages')
;(async () => {
  const version = require('../lerna.json').version

  const pkgs = getPackages()

  pkgs.forEach((shortName) => {
    const name = shortName === 'ydk' ? shortName : `@${pakcageName}/${shortName}`

    const pkgJSONPath = join(__dirname, '..', 'packages', shortName, 'package.json')
    const pkgJSONExists = existsSync(pkgJSONPath)
    if (args.force || !pkgJSONExists) {
      const json = {
        name,
        version,
        description: name,
        main: 'lib/index.js',
        types: 'lib/index.d.ts',
        files: ['lib', 'src'],
        repository: {
          type: 'git',
          url: 'http://git.yryz.com/lovelorn/frontend/ydk-web',
        },
        keywords: ['ydk'],
        authors: ['zhulin <zl12405614@gmail.com> (https://github.com/alittletired)'],
        license: 'MIT',
        bugs: 'http://github.com/ydkjs/ydk/issues',
        homepage: `https://github.com/ydkjs/ydk/tree/master/packages/${shortName}#readme`,
        publishConfig: {
          access: 'public',
        },
      }
      if (pkgJSONExists) {
        const pkg = require(pkgJSONPath)
        ;[
          'dependencies',
          'devDependencies',
          'peerDependencies',
          'bin',
          'files',
          'authors',
          'types',
          'sideEffects',
          'main',
          'module',
        ].forEach((key) => {
          if (pkg[key]) json[key] = pkg[key]
        })
      }
      writeFileSync(pkgJSONPath, `${JSON.stringify(json, null, 2)}\n`)
    }

    if (shortName !== 'ydk') {
      const readmePath = join(__dirname, '..', 'packages', shortName, 'README.md')
      if (args.force || !existsSync(readmePath)) {
        writeFileSync(readmePath, `# ${name}\n`)
      }
    }
  })
})()
