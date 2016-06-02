import { arrUnique, getValFromExp, objTree, removeObjProxy } from 'utils'

export default class parser {
  constructor(tpl, data) {
    this._data = data
    this._tpl = tpl
    this._dataKey = objTree()
  }

  parse() {
    let tplStr = this._tpl.innerHTML
    let attrPattern = /\w*="{{[\s\w\.\-]*}}"/g
    let textPattern = /[^"]{{[\s\w\.\-]*}}/g
    let attrMatch = tplStr.match(attrPattern)
    let textMatch = tplStr.match(textPattern)
    attrMatch = arrUnique(attrMatch)
    textMatch = arrUnique(textMatch)
    
    // replace order cannot change! replace attr first.
    
    /**
     * TODO:
     * multi element has same attr bind
     * remove same item in array
     * replace them with same data-bind-key 
     */
    for (let i = 0; i < attrMatch.length; i++) {
      let replace = this._replaceVar('attr', tplStr, attrMatch[i])
      tplStr = replace.htmlStr
      
      let dataKeyItem = {
        id: replace.elmId,
        type: 'attr',
        attr: replace.elmAttr
      }
      
      this._setDataKey(replace.key, dataKeyItem)
    }

    for (let i = 0; i < textMatch.length; i++) {
      let replace = this._replaceVar('text', tplStr, textMatch[i])
      tplStr = replace.htmlStr
      
      let dataKeyItem = {
        id: replace.elmId,
        type: 'text', 
        attr: null
      }
      
      this._setDataKey(replace.key, dataKeyItem)
    }
    
    this._tpl.innerHTML = tplStr;
    
    return {
      tplContent: this._tpl.content,
      dataKey: removeObjProxy(this._dataKey)
    }
  }
  
  /**
   * @param {String} replaceType: attr or text
   * @param {String} htmlStr: template innerHTML
   * @param {String} item: replace pattern {{ variable }}
   * @return {String} htmlStr
   */
  _replaceVar(replaceType, htmlStr, item) {
    let randKey = String(Math.random()).slice(2)
    let variable = item.match(/{{([\s\w\.\-]*)}}/)[1]
    variable = variable.trim()
    
    let value = getValFromExp(this._data, variable)
    let pattern = new RegExp(item, 'g')
    let attr = null
    let replaceMent

    if (replaceType === 'attr') {
      /**
       * before: <input value="{{ abc }}">
       * after: <input value="xxx" data-bind-key="xyz">
       * replace [[ {{ abc }} ]] with [[ xxx" data-bind-key="xyz ]]
       * so data-bind-key just has singal quotation marks
       */
      let bindFlag = `data-bind-id="${randKey}`
      replaceMent = item.replace(/{{[\s\w\.\-]*}}/, `${value}" ${bindFlag}`)
      attr = item.match(/(\w*)=.*/)[1]   
    } else {
      /**
       * before: <p>hello {{ name }}</p>
       * after: <p>hello <span data-bind-key="xxx"> xyz </span></p>
       */
      let bindFlagStart = `<span data-bind-id="${randKey}">`;
      let bindFlagEnd = '</span>';
      replaceMent = `${bindFlagStart}${value}${bindFlagEnd}`;
    } 
    
    htmlStr = htmlStr.replace(pattern, replaceMent)
    
    return {
      htmlStr: htmlStr,
      key: variable,
      elmId: randKey,
      elmAttr: attr
    }    
  }

  _setDataKey(key, value) {
    let val = value    // ???
    if (key.indexOf('.') === -1) {
      if (this._dataKey.hasOwnProperty(key)) {
        this._dataKey[key].push(value)
      } else {
        this._dataKey[key] = [value]
      }
    } else {
      // console.log(value)   // undefined????
      
      let keyArr = key.split('.')
      let keyLen = keyArr.length
      let codeStr = 'this._dataKey'
      let obj = this._dataKey
      let hasKey = true
      let value = JSON.stringify(val)
      
      for(let i = 0; i < keyLen; i++) {
        codeStr += `["${keyArr[i]}"]`
        if (obj.hasOwnProperty(keyArr[i])) {
          obj = obj[keyArr[i]]
        } else {
          hasKey = false
        }
      }
      
      if (!hasKey) {
        eval(`${codeStr} = []`)
      }
      
      eval(`${codeStr}.push(${value})`)
    }
    
  }
  
}
