import React from 'react'
import {Switch} from 'antd'
import FormItem, {FormItemProps} from './FormItem'
import {SwitchProps} from 'antd/lib/switch'

type FormSwitchProps = FormItemProps & {switchProps?: SwitchProps}
const FormSwitch: React.FC<FormSwitchProps> = (props) => {
  let {switchProps, ...itemProps} = props
  return (
    <FormItem {...itemProps} valuePropName="checked">
      <Switch {...switchProps} />
    </FormItem>
  )
}
export default FormSwitch
