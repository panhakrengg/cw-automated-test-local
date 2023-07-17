import Epic from '../../../../classes/Epic'
import Faker from '../../../../classes/utilities/Faker'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Field from '../../../../classes/constants/Field'

describe(Epic.Account, () => {
  const manageCourses = new ManageCourses(OrgConst.NAME)
  const faker = new Faker()
  let courseTimezone
  let courseId
  let courseActivityId

  before(() => {
    new YamlHelper('account')
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        faker.setPathFixture(courseTimezone)
        courseId = faker.getUrlId()
        faker.setPathFixture(courseTimezone.selfStudy)
        courseActivityId = faker.getUrlId()
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Course Administrator able to see add course activities follow account timezone in Org LMS', () => {
      Story.ticket('QA-1337', ['CW-15685'])
      manageCourses.loginAsCourseAdminInJapan()
      manageCourses.accessCourseInstanceBy(courseId, courseActivityId, Field.OVERVIEW)
      manageCourses.clickSideBarBy('Course Activities') //bug: remove after bug is fixed
      manageCourses.expectToShowTimezoneInEditCourseActivityBy('Physical Class')
      manageCourses.expectToShowTimezoneInEditCourseActivityBy('Virtual Class')
      manageCourses.expectToShowTimezoneInEditCourseActivityBy('Interactive eLearning')
    })
  })
})
