class Portlet {
  _id = '**p_p_id='
  _cache = '&p_p_lifecycle=2&p_p_cacheability=cacheLevelPage'
  constructor(name) {
    this._id += name
  }
  getPath() {
    return this._id + this._cache
  }
  getId() {
    return this._id
  }
}

export default Portlet
