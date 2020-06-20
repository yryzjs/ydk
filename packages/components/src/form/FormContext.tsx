import React from 'react'
interface FormContext {
  loading: boolean
  setLoading: (loading: boolean) => void
  onSuccess(data: any): void
}
const FormContext = React.createContext<FormContext>({
  loading: false,
  setLoading(loading: boolean) {},
  onSuccess(data: any) {},
})
export const useFormContext = () => React.useContext(FormContext)
export default FormContext
