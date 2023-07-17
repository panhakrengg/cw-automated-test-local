import CourseActivity from '../../base-manage-course/CourseActivity'

class ManageCourseActivity extends CourseActivity {
  constructor() {
    super()
  }

  _expectToSeeCourseActivityChangeOrder() {
    super._expectToSeeCourseActivityChangeOrder('#_copMemberManagementPortlet_activityAccordion')
  }

  _reorderCourseActivity() {
    super._reorderCourseActivity()
  }

  _revertReorderCourseActivity() {
    super._revertReorderCourseActivity()
  }
}

export default ManageCourseActivity
