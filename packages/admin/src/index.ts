import {useLocation} from 'react-router-dom'

export {default as AppContainer} from './AppContainer'
export function useQuery() {
  const location = useLocation()
  return new URLSearchParams(location.search)
}
