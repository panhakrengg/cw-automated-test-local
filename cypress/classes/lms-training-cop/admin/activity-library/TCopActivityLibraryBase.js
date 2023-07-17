import ActivityLibraryActions from '../../../lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../lms-admin/base/assertions/ActivityLibraryAssertions'
import LoginToActivityLibraryAs from '../Login/LoginToActivityLibraryAs'
import TCopActivityLibraryYaml from '../mock/TCopActivityLibraryYaml'
import ActivityLibraryListAction from './actions/ActivityLibraryListAction'

export default class TCopActivityLibraryBase {
  constructor() {
    this.login = new LoginToActivityLibraryAs()
    this.yaml = new TCopActivityLibraryYaml()
    this.tCopAction = new ActivityLibraryListAction()
    this.orgActions = new ActivityLibraryActions()
    this.orgAssertions = new ActivityLibraryAssertions()
  }
}
