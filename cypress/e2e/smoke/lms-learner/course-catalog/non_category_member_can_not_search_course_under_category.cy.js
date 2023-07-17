import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Learning from '../../../../classes/lms/Learning'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const faker = new Faker()
  let courseInfo, courseId, orgFullCatalogId, categoryName

  before(() => {
    new YamlHelper('lms/sample-lms')
      .read()
      .its('CourseData.underSoftSkill')
      .then((underSoftSkill) => {
        courseInfo = underSoftSkill
        faker.setPathFixture(underSoftSkill)
        courseId = faker.getUrlId()
      })
    new YamlHelper('org-structure/org-info')
      .read()
      .its('FireCloudZone.lms.orgFullCatalog')
      .then((orgFullCatalog) => {
        faker.setPathFixture(orgFullCatalog)
        orgFullCatalogId = faker.getUrlId()
      })
    SignInAs.member_Arielle()
  })

  context(Story.courseCatalog, () => {
    it('Non-category Member not able to search course under category', () => {
      Story.ticket('QA-1493')
      learning.visitLearningPage()
      learning.expectEmptyResultWhenSearchCourse(courseInfo.name)
      learning.expectOrganizationButNoCategoryInFilerCourse(
        orgFullCatalogId,
        courseInfo.categories.softSkill.name
      )
      courseDetail.expectedAccessDeniedFromCourseCatalog(courseId)
    })
  })
})
