import LoginToChangeLogAs from '../login/LoginToChangeLogAs'
import LogActivityLibraryYaml from '../mock/LogActivityLibraryYaml'
import ChangeLogActions from './actions/ChangeLogActions'
import ChangeLogAssertions from './assertions/ChangeLogAssertions'

export default class ChangeLogBase {
  constructor() {
    this.login = new LoginToChangeLogAs()
    this.action = new ChangeLogActions()
    this.assertion = new ChangeLogAssertions()
    this.yaml = new LogActivityLibraryYaml()
  }
}
