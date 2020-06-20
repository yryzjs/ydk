import React, {useEffect, useState} from 'react'
import {Spin} from 'antd'
import {RouteComponentProps} from 'react-router-dom'
interface Props extends RouteComponentProps {
  component: () => Promise<PageComponent>
}
const AsyncComponent: React.FC<Props> = ({component, ...props}) => {
  const [LoadComponent, setLoadComponent] = useState(() => null as PageComponent)
  useEffect(() => {
    component().then(setLoadComponent)
  }, [component])
  if (!LoadComponent) return <Spin />
  return <LoadComponent {...props} />
}
export default AsyncComponent
