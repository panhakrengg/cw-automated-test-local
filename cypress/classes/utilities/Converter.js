class Converter {
  static getNumberFrom(text) {
    return parseInt(text.match(/^[0-9]*([,.][0-9]+)?s$/g))
  }
  static getStringFrom(text) {
    return text.match(/[a-zA-Z]+/g)[0]
  }
  static getNumberFromEndOfString(text) {
    return text.match(/[0-9]+$/g)[0]
  }
  static getContentFrom(text) {
    return text.match(/[a-zA-Z]+/g).join(' ')
  }
  static removeSpecialCharacter(text) {
    return text.replace(/[() ]/g, '')
  }
  static getNumberFromString(str) {
    return str.match(/\d+/)[0]
  }
  static getTruncateContent(content, maxLength) {
    if (content.length > maxLength) {
      let subContent = content.substr(0, maxLength)
      return subContent + '...'
    }
    return content
  }
}

export default Converter
