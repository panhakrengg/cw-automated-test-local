// TODO: Workaround because table render slow even get API resource done

import InterceptReq from '../base/InterceptReq'
class WaitUtil {
  static _itcAllResourceLoaded = new InterceptReq('**', 'interceptAllResourceLoaded')

  static setAllResourceLoaded() {
    this._itcAllResourceLoaded.set()
  }

  static waitAllResourceLoads() {
    this._itcAllResourceLoaded.wait()
  }
}

export default WaitUtil
