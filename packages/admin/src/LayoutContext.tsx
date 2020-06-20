import React, {useState, useCallback} from 'react'
import {PermissionProvider} from './permission'

export interface LayoutContext {
  toggle: () => void
  collapsed: boolean
}
const LayoutContext = React.createContext<LayoutContext>({} as any)
export const LayoutProvider: React.FC = (props) => {
  const [collapsed, setCollapse] = useState(false)
  const toggle = useCallback(() => {
    setCollapse((collapsed) => !collapsed)
  }, [])
  return (
    <LayoutContext.Provider value={{collapsed, toggle}}>
      <PermissionProvider>{props.children}</PermissionProvider>
    </LayoutContext.Provider>
  )
}
export default LayoutContext
export const useLayoutContext = () => React.useContext(LayoutContext)
