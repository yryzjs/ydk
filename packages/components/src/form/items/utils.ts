export function isIdOptionType<T>(option: any): option is IdOptionType {
  return (option as IdOptionType).id !== undefined
}
