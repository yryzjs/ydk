import React from 'react'
export interface Config {
  routes: ObjectType<PageComponent>
  menus: Menu[]
  appName: string
  systemName: string
  loginUrl?: string
}
export const AppConfigContext = React.createContext({} as Config)
export const useConfigContext = () => React.useContext(AppConfigContext)
