import React, {useMemo} from 'react'
import {Select} from 'antd'
import {SelectProps as AntdSelectProps, SelectValue} from 'antd/lib/select'

const Option = Select.Option
export interface SelectProps<T> extends AntdSelectProps<string> {
  optionData?: T[]
  labelField?: keyof T
  valueField?: keyof T

  // onChange?:
}
export default function FormSelect<T>(props: SelectProps<T>) {
  let {optionData = [], labelField = 'name', valueField = 'id', ...rest} = props
  let style = props.style || {minWidth: 120}

  let optionDom = useMemo(() => {
    return optionData.map((option: any) => {
      let value: string | number
      let label: string | number
      if (typeof option === 'string' || typeof option === 'number') {
        value = label = option
      } else {
        value = option[valueField]
        label = option[labelField]
      }

      return (
        <Option key={value} value={value} data={option}>
          {label}
        </Option>
      )
    })
  }, [labelField, optionData, valueField])
  return (
    <Select style={style} {...rest}>
      {optionDom}
    </Select>
  )
}
