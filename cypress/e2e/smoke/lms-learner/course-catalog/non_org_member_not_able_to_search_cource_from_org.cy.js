import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const faker = new Faker()
  let courseInfo, courseId

  before(() => {
    new YamlHelper('lms/sample-lms')
      .read()
      .its('CourseData.mvcPattern')
      .then((mvcPattern) => {
        courseInfo = mvcPattern
        faker.setPathFixture(mvcPattern)
        courseId = faker.getUrlId()
      })

    SignInAs.cwNormalUser()
  })

  context(Story.courseCatalog, () => {
    it('Non-org Member not able to search course from organization', () => {
      Story.ticket('QA-1492')
      learning.visitLearningPage()
      learning.expectEmptyResultWhenSearchCourse(courseInfo.name)
      learning.expectOnlyCrosswiredEntryInCategoryCommunityFilterSection()
      courseDetail.expectedAccessDeniedFromCourseCatalog(courseId)
    })
  })
})
