import React, {useState, useRef, useMemo} from 'react'
import * as ReactDOM from 'react-dom'
import {Modal} from 'antd'
import {ModalProps, ModalFuncProps} from 'antd/lib/modal'

import './index.less'
import FormContext from '../form/FormContext'

export interface ModalFormProps {
  onDismiss: OnDismiss
  onSuccess: OnDismiss
  modalProps: ModalProps
}
const ModalForm: React.FC<ModalFormProps> = ({onDismiss, modalProps, ...props}) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(true)
  const warpClass = useRef('modal-' + new Date().getTime())
  const onOk = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    let rootDiv = document.querySelector('.' + warpClass.current)
    let form = rootDiv.querySelector('form')
    //表单的 onsubmit 事件句柄不会被调用。
    var button = form.ownerDocument.createElement('input')
    //make sure it can't be seen/disrupts layout (even momentarily)
    button.style.display = 'none'
    //make it such that it will invoke submit if clicked
    button.type = 'submit'
    //append it and click it
    form.appendChild(button).click()
    //if it was prevented, make sure we don't get a build up of buttons
    form.removeChild(button)
    return false
  }
  const onSuccess = (data: any) => {
    props.onSuccess && props.onSuccess(data)
    onDismiss(data)
  }
  return (
    <Modal
      wrapClassName={warpClass.current}
      visible={visible}
      className="modal"
      onOk={onOk}
      {...modalProps}
      onCancel={() => onDismiss()}>
      <FormContext.Provider value={{loading, setLoading, onSuccess}}>
        {props.children}
      </FormContext.Provider>
    </Modal>
  )
}
type OnSuccess = {onSuccess?: OnDismiss}
export default {
  showForm<T>(Component: FormComponent<T>, props?: T & OnSuccess): Promise<any> {
    return new Promise((resolve) => {
      let div = document.createElement('div')

      document.body.appendChild(div)
      let onDismiss: OnDismiss = (data?: any) => {
        if (!div) return
        requestAnimationFrame(() => {
          ReactDOM.unmountComponentAtNode(div)
          // console.warn('onDismiss', div, div.parentNode)
          div.parentNode.removeChild(div)
          div = null
          resolve(data)
        })
      }
      let modalProps: ModalProps = {}
      if (Component.getModalProps) {
        modalProps = Component.getModalProps(props)
      }
      let onSuccess = (data: any) => {
        props.onSuccess && props.onSuccess(data)
      }
      ReactDOM.render(
        <ModalForm modalProps={modalProps} onDismiss={onDismiss} onSuccess={onSuccess}>
          <Component {...props} />
        </ModalForm>,
        div,
      )
    })
  },

  confirm<T>(
    data: T,
    onOk: Api<T, any>,
    content: string = '确定删除该记录吗?',
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return Modal.confirm({
        content,
        onOk: async () => {
          onOk(data)
          resolve(true)
        },
        onCancel: () => reject(false),
      })
    })
  },
}
