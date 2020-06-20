import {useRef, useEffect} from 'react'

export default function <T extends (...args: any[]) => any>(callback: T) {
  let ref = useRef(callback)
  useEffect(() => {
    ref.current = callback
  })
  return ref
}
