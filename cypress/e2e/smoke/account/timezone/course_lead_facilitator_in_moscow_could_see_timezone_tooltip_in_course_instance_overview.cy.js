import CourseDetail from '../../../../classes/lms/CourseDetail'
import Epic from '../../../../classes/Epic'
import Faker from '../../../../classes/utilities/Faker'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Field from '../../../../classes/constants/Field'

describe(Epic.Account, () => {
  const manageCourses = new ManageCourses(OrgConst.NAME)
  const courseDetail = new CourseDetail()
  const accountYaml = new YamlHelper('account')
  const faker = new Faker()
  let courseTimezone
  let courseTimezoneId
  let courseTimezoneVirtualClassroomId
  let courseActivities
  let plus0900TimeOffset
  let plus0300TimeOffset

  before(() => {
    accountYaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        faker.setPathFixture(courseTimezone)
        courseTimezoneId = faker.getUrlId()
        faker.setPathFixture(courseTimezone.virtualClass)
        courseTimezoneVirtualClassroomId = faker.getUrlId()
        courseActivities = data.virtualClass.courseActivities
      })
    accountYaml
      .read()
      .its('Timezone')
      .then((timezone) => {
        plus0900TimeOffset = timezone.plus0900.timeOffSet[1]
        plus0300TimeOffset = timezone.plus0300.timeOffSet[1]
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Lead Facilitator in Moscow views a course date in a course instance overview', () => {
      Story.ticket('QA-1344')
      manageCourses.loginAsCourseLeadFacilitatorInMoscow()
      manageCourses.itcFetchActivityConfig.set()
      manageCourses.accessCourseInstanceBy(
        courseTimezoneId,
        courseTimezoneVirtualClassroomId,
        Field.OVERVIEW
      )
      manageCourses.itcFetchActivityConfig.wait()
      //Todo: replace the invoke css with hover when have a solution
      manageCourses.invokeTimezoneTooltipElementVisibility()
      courseDetail.verifyDisplayConvertTimezoneTooltipIn(plus0300TimeOffset, plus0900TimeOffset)
      manageCourses.clickActivityToExpandAccordionBy(courseActivities.richText.title)
      courseDetail.hoverOnTableBody(courseActivities.richText.title)
      courseDetail.verifyDisplayConvertTimezoneTooltipIn(plus0300TimeOffset, plus0900TimeOffset)
    })
  })
})
