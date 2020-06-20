import {withStore} from './shareState'
interface AuthToken {
  isLogin: boolean
  accessToken?: string
  expiration?: string
  refreshToken?: string
  userId?: number
  permissions?: string[]
}
const defaultLogin: AuthToken = {isLogin: false}
const withAuth = withStore('auth', defaultLogin)
const permissions = new Set<string>()
withAuth.addListener((token) => {
  permissions.clear()
  token.permissions?.forEach(permissions.add)
})
export const loginOut = (loginPath = '/') => {
  withAuth.setShareState(defaultLogin)
  // eslint-disable-next-line
  window.location.href = loginPath
}

export const hasPermission = (code: string) => permissions.has(code)
export const getAuth = withAuth.getShareState
export const useAuth = withAuth.useShareState
