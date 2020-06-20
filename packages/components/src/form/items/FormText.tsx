import React from 'react'
import FormItem, {FormItemProps} from './FormItem'

const FormItemText: React.FC<FormItemProps> = (props) => {
  let {children, label = '', className = 'form-item-text', ...rest} = props
  return (
    <FormItem label={label} className={className} {...rest}>
      <div>{children}</div>
    </FormItem>
  )
}
export default FormItemText
