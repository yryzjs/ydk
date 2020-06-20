import React, {useMemo} from 'react'
import {Checkbox} from 'antd'
import {CheckboxGroupProps, CheckboxOptionType} from 'antd/lib/checkbox'
import FormItem, {FormItemProps} from './FormItem'
import {isIdOptionType} from './utils'
type OptionTypes = Array<CheckboxOptionType | string | IdOptionType>
type FormCheckGroupProps = FormItemProps & {checkboxGroupProps?: CheckboxGroupProps} & {
  options: OptionTypes
}

const FormCheckGroup: React.FC<FormCheckGroupProps> = (props) => {
  const checkOptions = useMemo(() => {
    return props.options.map((option) => {
      if (isIdOptionType(option)) {
        return {
          label: option.name,
          disabled: option.disabled,
          value: option.id,
        }
      }
      return option
    })
  }, [props.options])
  let {options, checkboxGroupProps, ...itemProps} = props

  return (
    <FormItem {...itemProps}>
      <Checkbox.Group options={checkOptions} {...checkboxGroupProps} />
    </FormItem>
  )
}
export default FormCheckGroup
