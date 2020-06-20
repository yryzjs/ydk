import React from 'react'
import FormItem, {FormItemProps} from './FormItem'
import {InputProps, TextAreaProps} from 'antd/lib/input'
import {Input} from 'antd'
type PickProps = 'type' | 'placeholder'
interface FormInputProps extends FormItemProps, Pick<InputProps, PickProps> {
  inputProps?: InputProps
  inputSize?: 'small' | 'default' | 'large'
}
type FormTextAreaProps = FormItemProps & {placeholder?: string} & {
  textAreaProps?: TextAreaProps
}

export const FormTextArea: React.FC<FormTextAreaProps> = (props) => {
  let {textAreaProps, placeholder, ...itemProps} = props
  return (
    <FormItem {...itemProps}>
      <Input.TextArea placeholder={placeholder} {...textAreaProps} />
    </FormItem>
  )
}

export const FormPassword: React.FC<FormInputProps> = (props) => {
  let {inputProps, placeholder, readOnly, inputSize, ...itemProps} = props
  return (
    <FormItem {...itemProps}>
      <Input.Password readOnly={readOnly} placeholder={placeholder} {...inputProps} />
    </FormItem>
  )
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  let {inputProps, type, readOnly, inputSize, ...itemProps} = props
  return (
    <FormItem {...itemProps}>
      <Input type={type} readOnly={readOnly} {...inputProps} />
    </FormItem>
  )
}

export default FormInput
