export default class DataProxy {
  constructor(target, handler = {}) {
    this._target = target
    this._handler = handler
  }
  
  setup(obj = this._target) {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        obj[key] = this.setup(obj[key])
      }
    }

    return new Proxy(obj, this._handler)
  }
  
}