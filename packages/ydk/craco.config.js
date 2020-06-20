const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const WebpackBar = require('webpackbar')
const CracoAntDesignPlugin = require('craco-antd')
// const CracoAlias = require('craco-alias')
const CracoBabelLoader = require('craco-babel-loader')
const CracoLessModulePlugin = require('./scripts/craco-less-module')
const path = require('path')
const fs = require('fs')
// Don't open the browser during development
process.env.BROWSER = 'none'
const includes = [fs.realpathSync('src')]
let ydkwebPath = ''
if (fs.existsSync('node_modules/ydk-web')) {
  ydkwebPath = fs.realpathSync('node_modules/ydk-web')
  includes.push(fs.realpathSync('src'), ydkwebPath)
}

module.exports = {
  webpack: {
    react: path.resolve('./node_modules/react'),
    configure: (webpackConfig, {env, paths}) => {
      ydkwebPath && webpackConfig.resolve.modules.push(ydkwebPath)
      webpackConfig.resolve.alias.react = path.resolve('./node_modules/react')
      // console.warn('webpackConfig', webpackConfig.module.rules[2].oneOf)
      // throw 'stop'
      return webpackConfig
    },
    plugins: [
      new WebpackBar({profile: true}),
      ...(process.env.NODE_ENV === 'development'
        ? [new BundleAnalyzerPlugin({openAnalyzer: false})]
        : []),
    ],
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: {'@primary-color': '#1DA57A'},
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoLessModulePlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: {'@primary-color': '#1DA57A'},
            javascriptEnabled: true,
          },
        },
        cssLoaderOptions: {
          // modules: {
          //   auto: (resourcePath) => {
          //     console.warn('resourcePath', resourcePath)
          //     return false
          //   },
          // },
          // modules: {
          //   localIdentName: '[local]_[hash:base64:5]',
          //   context: path.resolve(__dirname, 'src'),
          // },
        },
      },
    },
    {
      plugin: CracoBabelLoader,
      options: {
        includes: includes,
      },
    },
  ],
}
