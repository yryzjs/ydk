import React, {useState, useCallback, useMemo} from 'react'
import {Card} from 'antd'
import {CardProps} from 'antd/lib/card'
import './search.less'
interface UseSearch {
  refresh: () => void
}
interface SearchProps<T = object, D = any> {
  data?: Partial<T>
  api?: Api<T, D>
  //自动刷新
  autoRefresh?: boolean
  search?: UseSearch
}
interface SearchContext<T = any, D = any> extends SearchProps<T, D> {
  setData(data: D): void
  autoRefresh?: boolean
  operators: Map<string, Operator>
  refresh: () => void
}
export const useSearch = (): [UseSearch] => {
  return useMemo(() => {
    return [
      {
        refresh() {
          console.warn('需要设置search实例，如<SearchContainer search={search} ...')
        },
      },
    ]
  }, [])
}
export const SearchContext = React.createContext({data: null} as SearchContext)

export default function SearchContainer<T = any, D = T>(
  props: SearchProps<T, D> & CardProps,
) {
  let {api, className = '', autoRefresh = true, data: initData, ...restProps} = props
  const [data, setData] = useState(initData)
  const operators = useMemo(() => {
    return new Map<string, Operator>()
  }, [])
  const refresh = useCallback(() => {
    setData((preData) => {
      return {...preData}
    })
  }, [])
  if (props.search) {
    props.search.refresh = refresh
  }
  return (
    <SearchContext.Provider value={{operators, autoRefresh, refresh, setData, data, api}}>
      <Card {...restProps} className={`search-container ${props.className}`} />
    </SearchContext.Provider>
  )
}
