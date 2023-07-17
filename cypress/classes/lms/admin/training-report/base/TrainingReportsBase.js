import TrainingReportsActions from '../actions/TrainingReportsActions'
import TrainingReportsAssertions from '../assertions/TrainingReportsAssertions'
import {
  TrainingReportColumns,
  TrainingReportColumnsByRole,
  TrainingReportColumnsInCourseLevel,
  TrainingReportColumnsInInstanceLevel,
} from '../constants/TrainingReportsConstants'
import TrainingReportsLogin from './mock/TrainingReportsLogin'
import TrainingReportsYaml from './mock/TrainingReportsYaml'

class TrainingReportsBase {
  constructor() {
    this.actions = new TrainingReportsActions()
    this.assertions = new TrainingReportsAssertions()
    this.login = new TrainingReportsLogin()
    this.yaml = new TrainingReportsYaml()
    this.constantColumnByRole = TrainingReportColumnsByRole
    this.constantColumnCourseLevel = TrainingReportColumnsInCourseLevel
    this.constantColumnInstanceLevel = TrainingReportColumnsInInstanceLevel
    this.constantColumns = TrainingReportColumns
  }
}

export default TrainingReportsBase
