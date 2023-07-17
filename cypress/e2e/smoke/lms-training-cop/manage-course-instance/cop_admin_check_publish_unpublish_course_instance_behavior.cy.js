import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import PublishUnPublishCourse from '../../../../classes/lms/PublishUnPublishCourse'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let noActivityInstanceId
  let hasActivityInstanceId
  const faker = new Faker()
  const publishUnPublishCourse = new PublishUnPublishCourse()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const yamlHelper = new YamlHelper('/lms-training-cop/publish-unpublish-course')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      const course = CourseData.scoreInTennis
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(course.courseInstances.noActivity)
      noActivityInstanceId = faker.getUrlId()
      faker.setPathFixture(course.courseInstances.hasActivity)
      hasActivityInstanceId = faker.getUrlId()
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin check publish/unpublish course instance behavior', () => {
      Story.ticket('QA-1026')

      SignInAs.copAdmin()
      context('No activity course instance', () => {
        copManageInstance.goToInstanceOverview(courseId, noActivityInstanceId)
        publishUnPublishCourse.unPublish()
        copManageInstance.verifyConfirmPublishPopup(false)
        copManageInstance.verifyConfirmUnpublishPopup()
      })

      context('Have activity course instance', () => {
        copManageInstance.goToInstanceOverview(courseId, hasActivityInstanceId)
        publishUnPublishCourse.unPublish()
        copManageInstance.verifyConfirmPublishPopup()
        copManageInstance.verifyConfirmUnpublishPopup()
      })
    })
  })
})
