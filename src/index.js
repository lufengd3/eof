import Parser from 'Parser'
import DataProxy from 'DataProxy'

export default class EOF {
  /**
   * @param {String} elmId
   * @param {Object} data
   */
  constructor(elmId, data) {
    this.version = '0.0.2'

    this._doc = document.currentScript.ownerDocument
    this._tpl = this._doc.querySelector(`#${elmId}`)
    this._data = data
    this.name = elmId
    this.$              // data proxy 
    this._dataKey
    
    this._init();
  }

  _init() {
    let self = this
    let tpl = this._tpl
    let tplParser = new Parser(tpl, this._data)
    let result = tplParser.parse()
    let tplContent = result.tplContent
    this._data = result.data
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
    let setHandler = (target, key, value) => {
      console.log(`set ${key} = ${value}`)
      let idList = this._dataKey[key]
      let elms = []
      
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
    }
    
    let dataProxy = new DataProxy(this._data)
    
    dataProxy.handleSet(setHandler)
    this.$ = dataProxy.setup()
  }
}