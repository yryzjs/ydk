import React from 'react'
import {ColumnProps as AntColumnProps, ColumnType as AntdColumnType} from 'antd/lib/table'
export interface ColumnProps<T = any> extends Omit<AntdColumnType<T>, 'dataIndex'> {
  renderType?: 'date' | 'money' | 'datetime' | 'arrayJoin' | 'index'
  dataIndex?: keyof T
  dataPath?: string
}

export class IndexColumn<T> extends React.Component<ColumnProps<T>> {
  static defaultProps: ColumnProps<any> = {
    renderType: 'index',
  }
}

export default function TableColumn<T>(props: ColumnProps<T>): JSX.Element {
  return null
}
TableColumn.IndexColumn = IndexColumn
