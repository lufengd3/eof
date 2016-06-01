import { arrUnique } from 'utils'

export default class parser {
  constructor(tpl, data) {
    this._data = data
    this._tpl = tpl
    
  }

  parse() {
    let tplStr = this._tpl.innerHTML
    let data = this._data
    let dataKey = this._getDatakey()

    let attrPattern = /\w*="{{[\s\w]*}}"/g
    let textPattern = /[^"]{{[\s\w]*}}/g
    let attrMatch = tplStr.match(attrPattern)
    let textMatch = tplStr.match(textPattern)
    attrMatch = arrUnique(attrMatch)
    textMatch = arrUnique(textMatch)
    
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
      
      if (dataKey.hasOwnProperty(replace.key)) {
        dataKey[replace.key].push(dataKeyItem)
      } else {
        this._data[replace.key] = null
        dataKey[replace.key] = [dataKeyItem]
      }
    }

    for (let i = 0; i < textMatch.length; i++) {
      let replace = this._replaceVar('text', tplStr, textMatch[i])
      tplStr = replace.htmlStr
      
      let dataKeyItem = {
        id: replace.elmId,
        type: 'text', 
        attr: null
      }
      
      if (dataKey.hasOwnProperty(replace.key)) {
        dataKey[replace.key].push(dataKeyItem)
      } else {
        this._data[replace.key] = null
        dataKey[replace.key] = [dataKeyItem]
      }
    }
    
    this._tpl.innerHTML = tplStr;
    
    return {
      tplContent: this._tpl.content,
      dataKey: dataKey,
      data: this._data  // padding obj
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
    let variable = item.match(/{{\s*(\w*)\s*}}/)[1]
    let value = this._data[variable] ? this._data[variable] : ''
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
      replaceMent = item.replace(/{{\s*\w*\s*}}/, `${value}" ${bindFlag}`)
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
  
  _getDatakey() {
    let obj = {}
    
    for (let key in this._data) {
      obj[key] = []
    }
    
    return obj
  }
  
}
