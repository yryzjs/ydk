import React, {useCallback} from 'react'
import Upload, {UploadProps} from 'antd/lib/upload'
import ActionButton, {ButtonProps} from './ActionButton'
import callApi from '../../utils/callApi'
type ImportButtonProps<T> = ButtonProps<T> & ApiProps & {apiData: any}
const ImportButton = function <T>(props: ImportButtonProps<T>) {
  let {title, apiData, onClick, data, ...restProps} = props
  let uploadProps: UploadProps = {
    action: '/api/public/upload',
    name: 'file',
    showUploadList: false,
    onChange: async (info) => {
      let response = info.file.response
      if (response && response.code === 200) {
        let filePath = response.data
        await callApi(props, {...apiData, filePath})
      }
    },
  }
  let click = useCallback(() => {
    onClick(data)
  }, [data, onClick])
  return (
    <Upload {...uploadProps}>
      <ActionButton onClick={click} className="action-anchor" {...restProps}>
        {title}
      </ActionButton>
    </Upload>
  )
}
export default ImportButton
