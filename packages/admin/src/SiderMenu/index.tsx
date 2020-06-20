import React, {useMemo, useState, useEffect} from 'react'
import {Layout, Menu as AntdMenu} from 'antd'
import {Link, useLocation} from 'react-router-dom'
import './index.css'
import {useLayoutContext} from '../LayoutContext'
import {useConfigContext} from '../AppConfigContext'
const {Sider} = Layout
const parentMenuKeys = new Map<string, string>()
function getMenuKeys(pathname: string, routes: ObjectType<PageComponent>) {
  let key = pathname.toLowerCase()
  let route = routes[pathname]
  if (route) {
    return [key]
  }
  return []
}
const getOpenKeys = (selectKey: string) => {
  if (!selectKey) return []
  let parentKey = selectKey
  // console.warn('selectKey', selectKey)

  let openKeys = []
  while (parentMenuKeys.get(parentKey)) {
    parentKey = parentMenuKeys.get(parentKey)
    openKeys.push(parentKey)
  }
  return openKeys
}
function getMenuItems(
  menus: Menu[],
  routes: ObjectType<PageComponent>,
  parentKey: string,
) {
  let menuItems = []
  for (let menu of menus) {
    let menuItem: JSX.Element
    if (typeof menu === 'string') {
      let route = routes[menu]
      parentMenuKeys.set(menu, parentKey)
      menuItem = (
        <AntdMenu.Item key={menu}>
          <Link to={menu}>
            <span>{route.route.name}</span>
          </Link>
        </AntdMenu.Item>
      )
    } else {
      let key = menu.key ?? menu.name
      menuItem = (
        <AntdMenu.SubMenu key={menu.name} title={<span>{menu.name}</span>}>
          {getMenuItems(menu.children, routes, menu.name)}
        </AntdMenu.SubMenu>
      )
    }
    menuItems.push(menuItem)
  }
  return menuItems
}

const SiderMenu: React.FC<{menus: Menu[]}> = (props) => {
  const {pathname} = useLocation()
  const {menus} = props
  const {routes, appName} = useConfigContext()
  let layoutContext = useLayoutContext()
  let [selectedKeys, setSelectedKeys] = useState([])
  let [openKeys, setOpenKeys] = useState([])
  useEffect(() => {
    let selectedKeys = getMenuKeys(pathname, routes)
    setSelectedKeys(selectedKeys)
    setOpenKeys(getOpenKeys(selectedKeys[0]))
  }, [pathname, routes])
  const menuItems = useMemo(() => {
    return getMenuItems(menus, routes, '')
  }, [menus, routes])
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={layoutContext.collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',

        left: 0,
      }}>
      <div className="sider-logo">
        <Link to="/">
          <div>
            {/* <img src="/static/images/logo.png" alt="logo" /> */}
            <h1>{appName}</h1>
          </div>
        </Link>
      </div>
      <AntdMenu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}>
        {menuItems}
      </AntdMenu>
    </Sider>
  )
}
export default SiderMenu
