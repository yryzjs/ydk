import React, {useCallback} from 'react'
import icons from '../icons'
import {Button} from 'antd'
import {ButtonProps as AntdButtonProps} from 'antd/lib/button'
import {SearchContext} from '../search/SearchContainer'
export interface ButtonProps<T = any> extends Omit<AntdButtonProps, 'onClick'> {
  title?: string
  onClick: (data?: T) => any
  data?: T
  disabledRefresh?: boolean
  actionId?: number
  iconName?: IconKey
}
export default function ActionButton<T>(props: ButtonProps<T>) {
  let {
    children,
    icon,
    actionId,
    disabledRefresh,
    iconName,
    onClick,
    data,
    title,
    ...restProps
  } = props
  const search = React.useContext(SearchContext)

  // const { hasPermission } = useAuthorization()
  // if (actionId && !hasPermission(actionId)) return null
  if (iconName) {
    icon = icons[iconName]
  }
  let click = useCallback(async () => {
    let ret = await onClick(data)
    console.warn(disabledRefresh, search.autoRefresh, search.refresh)

    !disabledRefresh && search.autoRefresh && search.refresh()
    return ret
  }, [data, disabledRefresh, onClick, search])
  return (
    <Button {...restProps} onClick={click} icon={icon}>
      {children || title}
    </Button>
  )
}
