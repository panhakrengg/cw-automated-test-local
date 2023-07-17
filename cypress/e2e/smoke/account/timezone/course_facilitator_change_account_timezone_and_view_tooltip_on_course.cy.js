import Epic from '../../../../classes/Epic'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const manageCourses = new ManageCourses()
  const yaml = new YamlHelper('account')
  const faker = new Faker()
  let orgFullCatalogId
  let courseTimezone
  let courseActivities
  let plus0900TimeOffset
  let plus0200TimeOffset
  let londonTimeZone
  let israelTimeZone

  before(() => {
    yaml
      .read()
      .its('LearningAdmin.orgLms.webLearn')
      .then((webLearn) => {
        faker.setPathFixture(webLearn.orgFullCatalogId)
        orgFullCatalogId = faker.getUrlId()
      })
    yaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        courseActivities = data.virtualClass.courseActivities
      })
    yaml
      .read()
      .its('Timezone')
      .then((timezone) => {
        plus0900TimeOffset = timezone.plus0900.timeOffSet[1]
        plus0200TimeOffset = timezone.plus0200.timeOffSet[1]
        londonTimeZone = timezone.utcZero.london.timezone
        israelTimeZone = timezone.plus0200.israel.timezone
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Facilitator change account timezone and view timezone tooltips on a course', () => {
      Story.ticket('QA-1346')
      manageCourses.loginAsCourseFacilitator()
      context(`Change timezone to ${londonTimeZone}`, () => {
        manageCourses.updateTimezone(londonTimeZone)
      })

      context(`Verify the tooltip for ${londonTimeZone}`, () => {
        manageCourses.accessManageCourseBy(orgFullCatalogId)
        manageCourses.searchCourse(`"${courseTimezone.title}"`)
        manageCourses.hoverOnCourseActivityScheduleBy(courseTimezone.title, 'Virtual Classroom')
        manageCourses.verifyDisplayConvertFromUTCTimezoneTooltipTo(plus0900TimeOffset)
      })

      context(`Change timezone to ${israelTimeZone}`, () => {
        manageCourses.updateTimezone(israelTimeZone)
      })

      context(`Verify the tooltip for ${israelTimeZone}`, () => {
        manageCourses.accessManageCourseBy(orgFullCatalogId)
        manageCourses.searchCourse(`"${courseTimezone.title}"`)
        manageCourses.hoverOnCourseActivityScheduleBy(courseTimezone.title, 'Virtual Classroom')
        manageCourses.verifyDisplayConvertTimezoneTooltipIn(plus0200TimeOffset, plus0900TimeOffset)
      })
    })
  })
})
