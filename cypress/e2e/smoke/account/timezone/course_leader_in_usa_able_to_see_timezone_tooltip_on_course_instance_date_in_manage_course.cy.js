import Epic from '../../../../classes/Epic'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, { retries: 1 }, () => {
  const manageCourses = new ManageCourses()
  const yaml = new YamlHelper('account')
  const faker = new Faker()
  let courseTimezone
  let orgFullCatalogId
  let plus0900TimeOffset
  let minus0400TimeOffset

  before(() => {
    yaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
      })
    yaml
      .read()
      .its('LearningAdmin.orgLms.webLearn')
      .then((webLearn) => {
        faker.setPathFixture(webLearn.orgFullCatalogId)
        orgFullCatalogId = faker.getUrlId()
      })
    yaml
      .read()
      .its('Timezone')
      .then((timezone) => {
        plus0900TimeOffset = timezone.plus0900.timeOffSet[1]
        minus0400TimeOffset = timezone.minus0400.timeOffSet[1]
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Course Leader in USA able to see timezone tooltip on a course instance date in manage course', () => {
      Story.ticket('QA-1341')
      manageCourses.loginAsCourseLeaderInUSA()
      manageCourses.accessManageCourseBy(orgFullCatalogId)
      manageCourses.searchCourse(`"${courseTimezone.title}"`)
      manageCourses.hoverOnCourseActivityScheduleBy(courseTimezone.title, 'Virtual Classroom')
      manageCourses.verifyDisplayConvertTimezoneTooltipIn(minus0400TimeOffset, plus0900TimeOffset)
    })
  })
})
