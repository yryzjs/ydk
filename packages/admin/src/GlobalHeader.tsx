import React, {useState, useEffect, useMemo} from 'react'
import {Layout, Row, Col} from 'antd'
import {useLayoutContext} from './LayoutContext'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
const GlobalHeader = () => {
  let layoutContext = useLayoutContext()
  const MenuIcon = useMemo(
    () => (layoutContext.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined),
    [layoutContext.collapsed],
  )
  return (
    <Layout.Header className="site-layout-background " style={{padding: 0}}>
      <Row>
        <Col span={2}>
          <MenuIcon className="trigger" onClick={layoutContext.toggle} />
        </Col>
        <Col offset={14} span={8}>
          <div style={{textAlign: 'right', marginRight: '24px'}}></div>
        </Col>
      </Row>
    </Layout.Header>
  )
}
export default GlobalHeader
