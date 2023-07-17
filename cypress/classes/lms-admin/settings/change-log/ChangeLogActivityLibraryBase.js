import ActivityLibraryActions from '../../base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../base/assertions/ActivityLibraryAssertions'
import ChangeLogBase from './ChangeLogBase'

export default class ChangeLogActivityLibraryBase extends ChangeLogBase {
  constructor() {
    super()
    this.activityAction = new ActivityLibraryActions()
    this.activityAssertion = new ActivityLibraryAssertions()
  }
}
