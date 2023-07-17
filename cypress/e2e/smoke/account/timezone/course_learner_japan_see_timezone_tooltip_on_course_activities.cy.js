import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const courseDetail = new CourseDetail()
  const yaml = new YamlHelper('account')
  const faker = new Faker()
  let booking
  let courseTimezone
  let courseTimezoneId
  let courseActivities
  let plus0900TimeOffset

  before(() => {
    yaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        faker.setPathFixture(courseTimezone)
        courseTimezoneId = faker.getUrlId()
        courseActivities = data.selfStudy.courseActivities
        booking = new Booking(courseTimezoneId)
      })
    yaml
      .read()
      .its('Timezone')
      .then((timezone) => {
        plus0900TimeOffset = timezone.plus0900.timeOffSet[1]
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Course Learner in Japan able to see timezone tooltips on course activities in a booked course instance', () => {
      Story.ticket('QA-1338')
      courseDetail.loginAsCourseLearnerInJapan()
      booking.accessToCourseDetail()
      courseDetail.clickButtonStartCourse(0)
      courseDetail.clickOnCourseActivity(courseActivities.virtualClass.title)
      //Waiting accordion completely expand before hover
      cy.waitLoadingOverlayNotExist()
      courseDetail.hoverOnTableBody(courseActivities.virtualClass.title)
      courseDetail.verifyDisplayInYourTimezoneTooltip(plus0900TimeOffset)
    })
  })
})
