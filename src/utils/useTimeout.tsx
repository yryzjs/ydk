import {useRef, useEffect, useCallback} from 'react'

export default function useTimeout() {
  let timer = useRef(null)
  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])
  return function <T extends (...args: any[]) => any>(callback: T, timeout: number) {
    timer.current = setTimeout(callback)
  }
}
