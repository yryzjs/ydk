import React from 'react'
import callApi from '../../utils/callApi'
import ActionButton, {ButtonProps} from './ActionButton'
interface ExportButtonProps<D> extends ButtonProps<D>, ApiProps<D> {
  fileName: string
}
export default function ExportButton<D>(props: ExportButtonProps<D> & ButtonProps<D>) {
  let {fileName, ...restProps} = props
  return (
    <ActionButton
      {...restProps}
      onClick={async () => {
        let filePath = await callApi(restProps)
        window.location.href = `/api/public/download?filePath=${filePath}&fileName=${fileName}.xlsx`
      }}
    />
  )
}
