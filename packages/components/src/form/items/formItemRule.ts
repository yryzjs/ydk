const allValidateFields = ['required', 'min', 'max', 'pattern']

export function getRules(props: any, validateFields?: any[]) {
  validateFields = validateFields || allValidateFields
  return validateFields
    .filter((v) => props[v])
    .map((ruleName) => {
      let requireMsg = `${props.label} 不能为空`
      if (ruleName === 'required') {
        return {required: true, message: requireMsg}
      }
      if (ruleName === 'min') {
        let min = props[ruleName]
        return {min, message: `${props.label}至少${min}字`}
      }
      if (ruleName === 'max') {
        let max = props[ruleName]
        return {max, message: `${props.label}最多${max}字`}
      }
      if (ruleName === 'pattern') {
        let pattern = new RegExp(props[ruleName])
        return {pattern, message: `请输入正确的${props.label}`}
      }
      return null
    })
}
