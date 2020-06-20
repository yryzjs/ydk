import {useState} from 'react'
const useLegacyState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T>) => void] => {
  const [state, set] = useState<T>(initialState)
  const setState = (patch: Partial<T>) => {
    set((prevState) => Object.assign({}, prevState, patch))
  }

  return [state, setState]
}
export default useLegacyState
