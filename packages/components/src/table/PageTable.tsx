import React, {useState, useEffect, useCallback, useMemo, ReactNode} from 'react'
import {TableProps, TablePaginationConfig} from 'antd/lib/table'
import {Table} from 'antd'
import {formatDate, formatDateTime} from '../../utils/dateUtils'
import type {ColumnProps} from './TableColumn'
import './index.less'
import {SearchContext} from '../search/SearchContainer'
import {toSearchData, getProperty} from '../../utils'

interface Props<T> extends Omit<TableProps<T>, 'columns'> {
  defaultPage?: number
  defaultOrder?: string
  defaultSize?: number
  children?: ReactNode
  columns?: ColumnProps<T>[]
  fetchWhen?: boolean | string | number | Func<T>
}
export type {ColumnProps}
export default function PageTable<T extends object>(props: Props<T>): React.ReactElement {
  let searchContext = React.useContext(SearchContext)
  let [loading, setLoading] = useState(false)
  let [params, setParams] = useState<PageRequest>({
    pageIndex: props.defaultPage || 1,
    pageSize: props.defaultSize || 10,
    orderBy: props.defaultOrder,
  })

  let [tableData, setTableData] = useState(() => {
    let dataSource = props.dataSource ?? []
    return {total: 0, dataSource}
  })
  const onPageChange = useCallback((pageIndex: number, pageSize?: number) => {
    setParams((page) => {
      return {...page, pageIndex, pageSize}
    })
  }, [])

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          let data = {...searchContext.data, ...params}
          if (typeof props.fetchWhen !== 'undefined') {
            if (typeof props.fetchWhen === 'function' && !props.fetchWhen(data as any)) {
              return
            } else if (!props.fetchWhen) {
              return
            }
          }

          setLoading(true)
          let apiResult = await searchContext.api(
            toSearchData(data, searchContext.operators),
          )

          let dataSource = apiResult.items || []
          dataSource.forEach(
            (item: any, index: number) =>
              (item._index = (params.pageIndex - 1) * params.pageSize + index + 1),
          )
          setTableData((state) => ({
            dataSource,
            total: apiResult.total,
          }))
        } catch (ex) {
          console.warn('pagetable', ex)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    },
    // eslint-disable-next-line
    [searchContext, params],
  )
  const columns = useMemo(() => {
    let columns = props.columns || []
    if (!columns.length) {
      let tableColumns = React.Children.toArray(props.children)
      for (let i = 0; i < tableColumns.length; i++) {
        let coloumn = tableColumns[i] as any
        let columProps = coloumn.props as ColumnProps
        // let width = props.width || 100;
        columns.push({...columProps} as any)
      }
    }

    for (let i = 0; i < columns.length; i++) {
      let column = columns[i]
      // let width = props.width || 100;
      column.key = column.key || `col_${i}`
      switch (column.renderType) {
        case 'date':
        case 'datetime':
          column.align = column.align || 'center'
          break
        case 'money':
          column.align = 'right'
          break
        case 'index':
          column = {
            width: 50,
            title: '序号',
            dataIndex: '_index' as any,
            align: 'center',
            className: 'table-index-column',
            ...column,
          }
          columns[i] = column
          break
      }
      if (column.render) continue

      if (column.renderType && column.dataIndex) {
        column.render = (text, data) => {
          if (column.renderType === 'date') {
            return formatDate(getProperty(data, column.dataIndex))
          } else if (column.renderType === 'datetime') {
            return formatDateTime(getProperty(data, column.dataIndex))
          } else if (column.renderType === 'arrayJoin') {
            let arr: any[] = getProperty(data, column.dataIndex)
            if (!arr) return ''
            return arr.join(',')
          }
          return getProperty(data, column.dataIndex)
        }
      } else if (column.dataPath) {
        column.render = (text, data) => {
          let paths = column.dataPath.split('.')
          let value = getProperty(data, paths[0])
          if (paths.length > 1) value = value[paths[1]]
          if (paths.length > 2) value = value[paths[2]]
          return value
        }
      }
    }

    return columns
  }, [props.children, props.columns])
  const onTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.Key[] | null>,
    sorter: any,
  ) => {
    console.warn('sorter', sorter)
    setParams({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      orderBy:
        (sorter.field || sorter.column.dataIndex) +
        ' ' +
        (sorter.order === 'descend' ? 'desc' : 'asc'),
    })
  }
  const pagination: TablePaginationConfig = {
    pageSize: params.pageSize,
    current: params.pageIndex,
    total: tableData.total,
    showSizeChanger: true,
    hideOnSinglePage: true,
  }
  return (
    <Table<T>
      rowKey="id"
      size="small"
      {...props}
      loading={loading}
      onChange={onTableChange}
      dataSource={tableData.dataSource}
      pagination={pagination}
      columns={columns}
    />
  )
}

// const ForwardPageTable = React.forwardRef(PageTable)
// ForwardPageTable.IndexColumn = IndexColumn
// todo: 没找到使用functioncompoent泛型并支持ref的方法,故使用class包裹一层
