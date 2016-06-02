import Parser from 'Parser'
import DataProxy from 'DataProxy'
import { isObjEqual } from 'utils'

export default class EOF {
  /**
   * @param {String} elmId
   * @param {Object} data
   */
  constructor(elmId, data) {
    this.version = '0.0.2'

    this._doc = document.currentScript.ownerDocument
    this._tpl = this._doc.querySelector(`#${elmId}`)
    this.data = data
    this.name = elmId
    this._dataKey
    
    this._init();
  }

  _init() {
    let self = this
    let tpl = this._tpl
    let tplParser = new Parser(tpl, this.data)
    let result = tplParser.parse()
    let tplContent = result.tplContent
    this._dataKey = result.dataKey
    
    if (!tpl) {
      throw new Error(`Can't find template Node: ${this.name}`)
    }

    let proto = Object.create(HTMLElement.prototype, {
      createdCallback: {
        value() {
          let clone = document.importNode(tplContent, true)

          // `this` is new Element, diff from `this` of EOF class
          let shadowRoot = this.createShadowRoot()
          
          shadowRoot.appendChild(clone)
          self._setDataProxy(shadowRoot)
        }
      }
    })
    
    document.registerElement(this.name, { prototype: proto })
  }

  _setDataProxy(doc) {
    let handleSet = (target, key, value, receiver) => {
      let idList, oldDataType
      let newDataType = typeof value
      
      if (this._dataKey.hasOwnProperty(key)) {
        idList = this._dataKey[key]
        oldDataType = typeof this.data[key]
      } else {
        for (let k in this.data) {
          if (isObjEqual(target, this.data[k])) {
            idList = this._dataKey[k][key]
            oldDataType = typeof this.data[k][key]
          }
        }
      }
      let elms = []

      // if (this.data[key] === value) {
      if (0) {
        return
      } else if (oldDataType !== newDataType) {
        throw new Error(`Can't change data type from ${oldDataType} to ${newDataType}`)
      }

      console.log(`set ${key}`)
      
      for (let i = idList.length; i--; ) {
        let id = idList[i]['id'] 
        let allElms = doc.querySelectorAll(`[data-bind-id="${id}"]`)
        
        for (let j = allElms.length; j--; ) {
          let elmInfo = {
            elm: allElms[j],
            type: idList[i]['type'],
            attr: idList[i]['attr']
          }
  
          elms.push(elmInfo)
        }
      }
      
      for (let i = elms.length; i--; ) {
        let elm = elms[i]['elm']
        let type = elms[i]['type']
        let attr = elms[i]['attr']
        
        if (type === 'attr') {
          elm.setAttribute(attr, value)  
        } else {
          elm.textContent = value
        }
        
      }
      
      return Reflect.set(target, key, value, receiver)
    }
    
    let handleDefine = (target, key, value, receiver) => {
      console.log(`define ${key} = ${value}, receiver is ${receiver}`)
    }
    
    let dataProxy = new DataProxy(this.data, {
      set: handleSet
      // defineProperty: handleDefine      
    })
    
    this.data = dataProxy.setup()
  }
}