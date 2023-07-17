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
  let courseTimezone
  let courseTimezoneId
  let booking
  let plus0900TimeOffset

  before(() => {
    yaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        faker.setPathFixture(courseTimezone)
        courseTimezoneId = faker.getUrlId()
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
    it('Course Learner in Japan able to see timezone tooltips on a book course detail page', () => {
      Story.ticket('QA-1342')
      courseDetail.loginAsCourseLearnerInJapan()
      booking.accessToCourseDetail()
      courseDetail.hoverOnBookingOptions(courseTimezone.virtualClass.type)
      courseDetail.verifyDisplayInYourTimezoneTooltip(plus0900TimeOffset)
    })
  })
})
