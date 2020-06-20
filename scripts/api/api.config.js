//demo
module.exports = {
  apis: [
    {
      name: 'ops',
      basePath: '',
      url: 'http://localhost:8080/v2/api-docs',
    },
  ],
  ignoreTypes: ['PageList', 'PageRequest'],
  mapTypes: {Timestamp: 'number', Int64: 'string'},
  codegenType: 'ts',
  pathSplitIndex: 2,
  responseWarp: '',
}
