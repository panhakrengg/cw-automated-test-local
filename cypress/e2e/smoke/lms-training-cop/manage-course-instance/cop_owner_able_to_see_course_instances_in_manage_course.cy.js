import Epic from '../../../../classes/Epic'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let course
  const copManageCourse = new CopManageCourse()
  const lmsTCoPMock = new LmsTrainingCopMock()

  const yamlHelper = new YamlHelper('/lms-training-cop/course-instances/view-course-instance')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      course = CourseData.scoreInTennis
    })
    lmsTCoPMock.setAdminLearnTennisUrl(copManageCourse)
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Owner able to see course instances in manage course', () => {
      Story.ticket('QA-1348')

      SignInAs.copOwner()
      const courseName = course.name
      copManageCourse.goToManageCourse()
      copManageCourse.viewAllInstances()

      context('Verify archive instance', () => {
        copManageCourse.verifyArchieveInstance(
          courseName,
          course.courseInstances.achieveInstance.date
        )
      })

      context('Verify draft instance', () => {
        copManageCourse.verifyNotArchiveInstance(
          courseName,
          course.courseInstances.draftInstance.date
        )
      })

      context('Verify publish instance', () => {
        copManageCourse.verifyNotArchiveInstance(
          courseName,
          course.courseInstances.publishInstance.date
        )
      })
    })
  })
})
