import {useRef, useEffect, useCallback} from 'react'

//防止重复提交
export default function useSubmit<T extends (...args: any[]) => Promise<P>, P>(
  func: T,
  delay: number = 200,
): T {
  let locking = useRef(false)
  let ref = useRef(func)
  let timer = useRef(null)
  useEffect(() => {
    ref.current = func
  })

  const doSubmit = useCallback(
    async (...args) => {
      if (locking.current) return
      locking.current = true
      try {
        let data = await ref.current(...args)
        return data
      } finally {
        timer.current = setTimeout(() => {
          locking.current = false
        }, delay)
      }
    },
    [delay],
  )

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])
  return (doSubmit as unknown) as T
}
