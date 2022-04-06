export const unixSecToDate = (_sec: number) => {
  const date1 = new Date()
  date1.setTime(_sec * 1000)
  return date1.toString()
}
