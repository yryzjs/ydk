import React from 'react'
import {Form} from 'antd'
import {FormItemProps as AntFormItemProps} from 'antd/lib/form'
import {getRules} from './formItemRule'
import {SearchContext} from '../../search/SearchContainer'
const AntFormItem = Form.Item

export interface FormItemProps extends Partial<AntFormItemProps> {
  min?: number
  max?: number
  operator?: Operator
  readOnly?: boolean
  pattern?: string
}
const horizontalItemLayout = {
  labelCol: {
    xxl: {span: 4},
    xl: {span: 4},
    lg: {span: 4},
    md: {span: 4},
    sm: {span: 4},
    xs: {span: 4},
  },
  wrapperCol: {
    xxl: {span: 14},
    xl: {span: 14},
    lg: {span: 14},
    md: {span: 14},
    sm: {span: 14},
    xs: {span: 14},
  },

  // xs:480, sm:576, md: 768, lg:992, xl:1200, xxl:1600
}

const FormItem: React.FC<FormItemProps> = (props) => {
  const searchContext = React.useContext(SearchContext)
  const {name, children, operator, ...restProps} = props
  if (name && operator) {
    searchContext.operators.set(name as string, operator)
  }
  const rules = getRules(props)
  return (
    <AntFormItem name={name} {...restProps} rules={rules}>
      {children}
    </AntFormItem>
  )
}

export default FormItem
