import {useLocation} from 'react-router-dom'

export {withStore} from '../../packages/core/src/shareState'
export {formatDate, formatDateTime} from './dateUtils'
export {default as useSubmit} from './useSubmit'
export {default as usePrevious} from './usePrevious'
export {default as useRefCallback} from './useRefCallback'
export {default as useLegacyState} from './useLegacyState'
export function toSearchData(originData: any, operators?: Map<string, Operator>) {
  if (!operators) return originData
  let data = {...originData}
  for (let [key, opr] of operators) {
    // 遍历Map
    if (typeof data[key] !== 'undefined') {
      data[key] = {opr, value: data[key]}
    }
  }
  return data
}
export function getProperty<T>(data: any, propertName: string | number) {
  return data[propertName]
}
