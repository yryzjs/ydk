import React, {useContext} from 'react'
import {ButtonProps} from 'antd/es/button'
import {Button} from 'antd'
import {FormItemProps} from './FormItem'
type FormButtonProps = Omit<
  FormItemProps &
    ButtonProps & {
      title: string
    },
  'children'
>

const FormButton: React.FC<FormButtonProps> = (props) => {
  let {title, ...restProps} = props
  return <Button {...restProps}>{title}</Button>
}
// FormButton.defaultProps = {
//   wrapperCol: {
//     xxl: { span: 16, offset: 8 },
//     xl: { span: 16, offset: 8 },
//     lg: { span: 16, offset: 8 },
//     md: { span: 16, offset: 8 },
//     sm: { span: 12, offset: 12 },
//     xs: { span: 24, offset: 0 },
//   },
// }
export default FormButton
export const SubmitButton = (props: FormButtonProps) => {
  // const pageContext = usePageContext()
  return <FormButton type="primary" htmlType="submit" {...props} />
}
export const ResetButton = (props: FormButtonProps) => {
  return <FormButton {...props} />
}
