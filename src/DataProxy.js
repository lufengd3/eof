export default class DataProxy {
  constructor(target) {
    this._target = target
    this._handler = {}
  }
  
  setup() {
    return new Proxy(this._target, this._handler)
  }
  
  handleSet(callback) {
    this._handler['set'] = callback
  }
  
}