import React, {useMemo, useRef} from 'react'
import {Input} from 'antd'
import FormItem, {FormItemProps} from './FormItem'
import Select, {SelectProps} from '../../select'

interface FormSelectProps<T> extends FormItemProps {
  selectProps?: SelectProps<T>
  labelName?: string
  optionData: T[]
  valueField?: keyof T
  labelField?: keyof T
  mode?: 'multiple' | 'tags'
}

export default function FormSelect<T>(props: FormSelectProps<T>) {
  let {selectProps, optionData, labelField, valueField, mode, ...itemProps} = props
  selectProps = {optionData, mode, labelField, valueField, ...selectProps}
  if (itemProps.labelName) {
    let {labelName, name, ...rest} = itemProps
    return (
      <FormItem {...rest} shouldUpdate>
        {(formInstance) => {
          return (
            <>
              <FormItem
                name={name}
                noStyle
                getValueFromEvent={(value, option) => {
                  formInstance.setFieldsValue({
                    [labelName]: option.data[labelField ?? 'name'],
                  })
                  return value
                }}>
                <Select {...selectProps} />
              </FormItem>
              <FormItem name={labelName} style={{display: 'none'}}>
                <Input />
              </FormItem>
            </>
          )
        }}
      </FormItem>
    )
  }
  return (
    <FormItem {...itemProps}>
      <Select {...selectProps} />
    </FormItem>
  )
  // const style = props.style || { width: 120 }
  // let { options, selectProps, ...restProps } = props
  // const optionsDom = useMemo(() => {
  //   return options.map(o => {
  //     let option = normalizeOption(o)
  //     return (
  //       <Option key={option.value} value={option.value}>
  //         {option.title}
  //       </Option>
  //     )
  //   })
  // }, [options])

  // return (
  //   <FormItem {...restProps}>
  //     <Select {...selectProps} style={style}>
  //       {optionsDom}
  //     </Select>
  //   </FormItem>
  // )
}
