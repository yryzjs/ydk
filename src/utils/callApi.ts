export default async function callApi<D, T>(
  apiProps: ApiProps<D, T>,
  data?: D,
): Promise<T> {
  let {api, onSuccess, onFail, onBefore} = apiProps

  data = {...apiProps.data, ...data}
  if (onBefore) {
    let beforeData = await onBefore(data)
    if (typeof beforeData == 'boolean' || !beforeData) {
      return
    } else {
      data = beforeData
    }
  }

  try {
    let output = await api(data)
    onSuccess && onSuccess(output)
    return output
  } catch (ex) {
    if (onFail) onFail(ex)
    else throw ex
  }
}
