import InterceptReq from '../base/InterceptReq'

class Dashboard {
  #itcGettingStart = new InterceptReq('/getting_start/fetch', 'GettingStart')

  interceptGettingStart() {
    this.#itcGettingStart.set()
  }

  waitGettingStart() {
    this.#itcGettingStart.wait()
  }
}

export default Dashboard
