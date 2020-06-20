import React from 'react'
import ActionButton, {ButtonProps} from './ActionButton'
export default function ActionAnchor<T>(props: ButtonProps<T>) {
  return <ActionButton type="link" className="action-anchor" {...props} />
}
