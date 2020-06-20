import React from 'react'
import FormItem, {FormItemProps} from './FormItem'
import {TimePicker as AntdTimePicker, DatePicker as AntdDatePicker} from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const dateFormat = 'YYYY-MM-DD'
const monthFormat = 'YYYY-MM'
const timeFormat = 'HH:mm:ss'
interface ItemProps {
  value?: any
  onChange?(value: any, values: any): void
}
function normalize(format: string, value: any): any {
  if (!value) return value
  if (Array.isArray(value)) {
    value = value.map((v) => normalize(format, v))
  }
  if (typeof value === 'string') {
    if (value.includes(',')) {
      return normalize(format, value.split(','))
    }
    return moment(value, format)
  }
  if (typeof value === 'number') {
    console.warn(value, moment(value, format))
    return moment(value)
  }
  return null
}
function normalizeString(format: string, value: any): any {
  if (Array.isArray(value)) {
    return value.map((v) => normalizeString(format, v)).join(',')
  }
  if (value instanceof moment) {
    return (value as any).utcOffset(480).format(format)
  }
  return value
}
function momentHoc<P>(format: string, Component: React.ComponentType<P>) {
  const MomentHoc: React.FC<ItemProps & P> = (props) => {
    // console.warn((props as any).id, (props as any).value, (props as any).onChange)

    const value = normalize(format, props.value)
    const onChange = (value: any, values: any) => {
      let str = normalizeString(format, value)
      props.onChange && props.onChange(str, values)
    }
    return <Component {...props} value={value} onChange={onChange} />
  }
  return MomentHoc
}

const {
  MonthPicker: AntdMonthPicker,
  RangePicker: AntdRangePicker,
  WeekPicker: AntdWeekPicker,
} = AntdDatePicker
export const FormRangePicker: React.FC<
  FormItemProps & {
    rangePickerProps?: any
  }
> = (props) => {
  let {rangePickerProps, ...itemProps} = props
  const RangePicker = momentHoc(dateFormat, AntdRangePicker)
  return (
    <FormItem {...itemProps}>
      <RangePicker {...rangePickerProps} />
    </FormItem>
  )
}

export const FormMonthPicker: React.FC<
  FormItemProps & {
    monthPickerProps?: any
  }
> = (props) => {
  let {monthPickerProps, ...itemProps} = props
  const MonthPicker = momentHoc(monthFormat, AntdMonthPicker)
  return (
    <FormItem {...itemProps}>
      <MonthPicker {...monthPickerProps} />
    </FormItem>
  )
}

export const FormWeekPicker: React.FC<
  FormItemProps & {
    weekPickerProps?: any
  }
> = (props) => {
  let {weekPickerProps, ...itemProps} = props
  const WeekPicker = momentHoc(dateFormat, AntdMonthPicker)
  return (
    <FormItem {...itemProps}>
      <WeekPicker {...weekPickerProps} />
    </FormItem>
  )
}

export const FormDatePicker: React.FC<
  FormItemProps & {
    datePickerProps?: any
  }
> = (props) => {
  let {datePickerProps, ...itemProps} = props
  const DatePicker = momentHoc(dateFormat, AntdDatePicker)
  return (
    <FormItem {...itemProps}>
      <DatePicker {...datePickerProps} />
    </FormItem>
  )
}

export const FormTimePicker: React.FC<
  FormItemProps & {
    timePickerProps?: any
  }
> = (props) => {
  // const initialValue = useInitialValue(props, timeFormat)
  let {timePickerProps, ...itemProps} = props
  const TimePicker = momentHoc(timeFormat, AntdTimePicker)
  return (
    <FormItem {...itemProps}>
      <TimePicker {...timePickerProps} />
    </FormItem>
  )
}
