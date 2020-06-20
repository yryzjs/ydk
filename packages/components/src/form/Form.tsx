import React from 'react'
import {Form, message} from 'antd'
import callApi from '../../utils/callApi'
import {useFormContext} from './FormContext'
import useSubmit from '../../utils/useSubmit'
type FormProps = Parameters<Form>[0]
function ApiForm<D, T, P>(props: ApiProps<D, T> & FormProps) {
  const {initialValues, api, onBefore, onFail, data, onSuccess, ...restProps} = props
  const formContext = useFormContext()

  //消除loading的警告
  const onFinish = useSubmit(async (values: any) => {
    try {
      values = {...initialValues, ...values}
      formContext.setLoading(true)
      let data = await callApi(props, values)
      typeof data !== 'boolean' && formContext.onSuccess(data)
      typeof data !== 'boolean' && onSuccess && onSuccess(data)
    } catch (ex) {
      console.error('onFinish', ex)

      message.error(ex?.data?.msg, 4)
    } finally {
      formContext.setLoading(false)
    }
  })

  const onFinishFailed = (errorInfo: any) => {
    console.log('onFinishFailed:', errorInfo)
  }
  const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
  }
  return (
    <Form
      autoComplete="off"
      layout="horizontal"
      colon={true}
      {...layout}
      {...restProps}
      onFinish={onFinish}
      initialValues={initialValues}
      onFinishFailed={onFinishFailed}
    />
  )
}
ApiForm.useForm = Form.useForm
ApiForm.List = Form.List
export default ApiForm
