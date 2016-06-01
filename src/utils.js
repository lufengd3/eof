export function arrUnique(arr) {
  let obj = {}
  
  for (let i = arr.length; i--; ) {
    arr[i] = arr[i].trim()
    obj[arr[i]] = null
  }
  
  return Object.keys(obj)
}