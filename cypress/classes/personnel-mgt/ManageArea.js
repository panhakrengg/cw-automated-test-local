import InterceptReq from '../base/InterceptReq'

class ManageArea {
  _itcArea = new InterceptReq('/org_management/manage_area/get', 'list')

  interceptArea() {
    this._itcArea.set()
  }
  wait() {
    this._itcArea.wait()
  }
}

export default ManageArea
