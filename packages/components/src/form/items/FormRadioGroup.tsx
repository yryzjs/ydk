import React, {useMemo} from 'react'
import {Radio} from 'antd'
import {RadioGroupProps} from 'antd/lib/radio'
import {CheckboxOptionType} from 'antd/lib/checkbox'
import FormItem, {FormItemProps} from './FormItem'
import {isIdOptionType} from './utils'
type OptionType = string | IdOptionType | CheckboxOptionType
type FormRadioGroupProps = FormItemProps & {radioGroupProps?: RadioGroupProps} & {
  radioType?: 'radio' | 'button'
  options: OptionType[]
}
const normalizeOption = (option: OptionType): CheckboxOptionType => {
  if (isIdOptionType(option)) {
    return {disabled: option.disabled, value: option.id, label: option.name}
  } else if (typeof option == 'string') {
    return {value: option, label: option}
  }
  return option
}
const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  radioType = 'radio',
  options = [],
  radioGroupProps,
  ...itemProps
}) => {
  const optionsDom = useMemo(() => {
    return options.map((option, index) => {
      const {value, label} = normalizeOption(option)
      if (radioType === 'button')
        return (
          <Radio.Button key={index} value={value}>
            {label}
          </Radio.Button>
        )

      return (
        <Radio key={index} value={value}>
          {label}
        </Radio>
      )
    })
  }, [radioType, options])

  return (
    <FormItem {...itemProps}>
      <Radio.Group {...radioGroupProps}>{optionsDom}</Radio.Group>
    </FormItem>
  )
}
export default FormRadioGroup
