import LmsManagementHelper from '../lms-training-cop/base-manage-course/LmsManagementHelper'
import BaseManageCourse from './base-manage-course/BaseManageCourse'

class CourseDetailOverview extends BaseManageCourse {
  constructor(courseData, courseInstance) {
    if (courseData) {
      super(courseData, courseInstance)
      this.courseInstance = courseInstance
    } else {
      super()
    }
  }

  verifyCourseOverview() {
    super._defineAliasMainContent()
    cy.get('@cardMainContent').within(() => {
      super._expectToCourseDetailInformation()
      super._expectToSeeCourseBanner()
      super._expectToSeeAdditionInfo()
      super._expectToSeeCourseAttachment()
      super._expectToSeeCourseTagSkill()
      this.completeLabel = `Completed: 0/${this.courseInstance.activities.total}`
      LmsManagementHelper._expectToSeeProgressMainSection({
        complete: { label: this.completeLabel, cssClazz: 'h5' },
        progressLabel: 'Course Progress',
      })
      super._expectToSeeCourseActivitySection()
    })
  }

  _verifyCourseProgressAndActivities() {
    super._defineAliasMainContent()
    cy.get('@cardMainContent').within(() => {
      this.completeLabel = `Completed: 0/${this.courseInstance.activities.total}`
      LmsManagementHelper._expectToSeeProgressMainSection({
        complete: { label: this.completeLabel, cssClazz: 'h5' },
        progressLabel: 'Course Progress',
      })
      super._expectToSeeCourseActivitySection()
    })
  }
}
export default CourseDetailOverview
