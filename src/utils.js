export function arrUnique(arr) {
  let obj = {}
  
  for (let i = arr.length; i--; ) {
    arr[i] = arr[i].trim()
    obj[arr[i]] = null
  }
  
  return Object.keys(obj)
}

export function getValFromExp(obj, exp) {
  if (exp.indexOf('.') === -1) {
    return obj[exp] ? obj[exp] : ''
  } else {
    let expArr = exp.split('.')
    for (let i = 0; i < expArr.length; i++) {
      obj = obj[expArr[i]]
    }
    
    return obj
  }
}

export function objTree(target = {}) {
  let handler = {
    get(target, key, receiver) {
      if (!(key in target)) {
        target[key] = objTree()
      }

      return Reflect.get(target, key, receiver)
    }
  }

  return new Proxy(target, handler)
}

export function removeObjProxy(obj) {
  let clone = {}
  
  for (let key in obj) {
    if (key !== 'splice') {
      if (obj[key].toString() === "[object Object]") {
        clone[key] = removeObjProxy(obj[key])
      } else {
        clone[key] = obj[key]
      }
    }
  }
  
  return clone
}

export function isObjEqual(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    return true;
}