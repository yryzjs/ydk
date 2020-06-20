import React, {useMemo} from 'react'
import ProtectedLayout from './ProtectedLayout'
import zhCN from 'antd/lib/locale/zh_CN'
import {ConfigProvider} from 'antd'
import moment from 'moment'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import 'moment/locale/zh-cn'
import {Config, AppConfigContext} from './AppConfigContext'
import './index.less'
import {PermissionProvider} from './permission'
moment.locale('zh-cn')
const PageContainer: React.FC<Config> = (props) => {
  const [publicRoutes, protectRoutes] = useMemo(() => {
    let publicRoutes: JSX.Element[] = []
    let protectRoutes: JSX.Element[] = []
    for (let path in props.routes) {
      let Component = props.routes[path]
      if (Component.route.layout === 'public') {
        publicRoutes.push(<Route exact key={path} path={path} component={Component} />)
      } else {
        protectRoutes.push(<Route key={path} path={path} component={Component} />)
      }
    }

    return [publicRoutes, protectRoutes]
  }, [props.routes])

  return (
    <AppConfigContext.Provider value={props}>
      <ConfigProvider locale={zhCN}>
        <PermissionProvider>
          <BrowserRouter>
            <Switch>
              {publicRoutes}
              <ProtectedLayout routes={protectRoutes} menus={props.menus} />
            </Switch>
          </BrowserRouter>
        </PermissionProvider>
      </ConfigProvider>
    </AppConfigContext.Provider>
  )
}
export default PageContainer
