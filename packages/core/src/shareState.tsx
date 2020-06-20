import React, {useState, useEffect} from 'react'
declare type Func<T = {}> = (value?: T) => void
type SetStateFunc<T> = (preState?: T) => T
export interface WithShareStateProps<T> {
  shareState: [T, Func<T>]
}

export function withShareState<T>(initValue: T) {
  let shareValue = initValue

  const listeners = new Set<Func<T>>()
  const addListener = (listener: Func<T>, initialInvoke = true) => {
    listeners.add(listener)
    //添加监听 默认调用一次
    initialInvoke && listener(shareValue)
  }
  const removeListener = (listener: Func<T>) => listeners.delete(listener)
  function setShareState(value: T | SetStateFunc<T>) {
    if (typeof value === 'function') {
      shareValue = (value as SetStateFunc<T>)(shareValue)
    } else {
      shareValue = value
    }

    listeners.forEach((setValue) => {
      setValue && setValue(shareValue)
    })
  }

  function ShareStateComponent<P>(
    Component: React.ComponentType<P & WithShareStateProps<T>>,
  ) {
    const WithStoreComponent: React.FC<P> = (props) => {
      const [value, setValue] = useState(shareValue)
      useEffect(() => {
        addListener(setValue)
        return () => removeListener(setValue)
      }, [])
      return <Component {...props} shareState={[shareValue, setShareState]} />
    }
    return WithStoreComponent
  }
  function useShareState(): [T, Func<T | SetStateFunc<T>>] {
    let [state, setState] = useState(shareValue)
    useEffect(() => {
      addListener(setState)
      return () => removeListener(setState)
    }, [])
    return [shareValue, setShareState]
  }
  ShareStateComponent.useShareState = useShareState
  ShareStateComponent.setShareState = setShareState
  ShareStateComponent.addListener = addListener
  ShareStateComponent.removeListener = removeListener
  ShareStateComponent.getShareState = () => shareValue
  return ShareStateComponent
}
const isBrowser = () => typeof window != 'undefined'
export function withStore<T>(persistKey: string, initValue: T) {
  let persistValue: string
  if (isBrowser()) {
    persistValue = localStorage?.getItem(persistKey)
  }
  if (persistValue) {
    initValue = typeof initValue === 'object' ? JSON.parse(persistValue) : persistValue
  }
  // console.debug('persistValue', initValue)
  let shareState = withShareState(initValue)
  shareState.addListener((data) => {
    if (typeof data === 'object') {
      localStorage.setItem(persistKey, JSON.stringify(data))
    } else {
      localStorage.setItem(persistKey, data.toString())
    }
  }, false)
  return shareState
}
