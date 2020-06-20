/// <reference types="react-scripts" />
/// <reference types="react-router" />
/// <reference path="./icons.d.ts" />
declare module '*.less'
declare type Func<T, D = any> = (value?: T) => D | Promise<D>
declare type OnDismiss = (data?: any) => void
declare type ObjectType<T> = {[key: string]: T}
interface PageComponent<P = {}> extends React.FC<RouteComponentProps<P>> {
  route: Route
}
type ImportPageComponent<P = {}> = () => Promise<PageComponent<P>>
interface FormComponent<P> extends React.FC<P> {
  getModalProps?: (props: P) => {title: string}
}
// component: React.ComponentType<any>
declare interface Route {
  path?: string
  //控制布局和权限 使用public将使用空布局，并不校验权限
  layout?: 'default' | 'empty' | 'public'
  name: string
  //将自动填充，规则为 moduleName +'.'+route.name
  key?: string
  parent?: PageComponent
}
declare type ObjectMenu = {
  //对应路由跳转地址
  name: string
  icon: IconType
  key?: string
  url: string
  children: Array<string | ObjectMenu>
}
declare type Menu = string | ObjectMenu
declare type ArrayMenu = Array<string | ObjectMenu>
declare interface Module {
  name: string
  key: string
  routes: PageComponent[]
  menus?: PageComponent[]
}
type IdOptionType = {
  id: number
  name: string
  disabled?: boolean
}

declare type Api<T = any, D = any> = (data: T) => Promise<D>
declare interface ApiProps<T = any, D = any> {
  api?: Api<T, D>
  data?: T
  onBefore?: (data: T) => Promise<T | boolean> | T | boolean
  onSuccess?(data: D): void
  onFail?(err: any): void
}
type PageList<T> = {items: T[]; total: number}

interface PageRequest {
  pageIndex?: number
  pageSize?: number

  orderBy?: any
}
interface DynamicQuery<T> extends PageRequest {
  [P in T]?: T[P] | {opr: Operator; value: T[P] | Array<T[P]>}
}

type Operator = 'like' | 'headLike' | 'tailLike' | 'in' | 'gt' | 'lt' | 'gte' | 'lte'
