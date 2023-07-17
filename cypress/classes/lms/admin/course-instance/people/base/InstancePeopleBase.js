import InstancePeopleActions from '../actions/InstancePeopleActions'
import InstancePeopleLogin from './mock/InstancePeopleLogin'

export default class InstancePeopleBase {
  constructor() {
    this.login = new InstancePeopleLogin()
    this.actions = new InstancePeopleActions()
  }
}
