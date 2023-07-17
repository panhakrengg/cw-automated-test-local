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
  let plus0700TimeOffset

  before(() => {
    yaml
      .read()
      .its('Courses.courseTimezone')
      .then((data) => {
        courseTimezone = data
        courseActivities = data.selfStudy.courseActivities
        faker.setPathFixture(courseTimezone)
        courseTimezoneId = faker.getUrlId()
        booking = new Booking(courseTimezoneId)
      })
    yaml
      .read()
      .its('Timezone')
      .then((timezone) => {
        plus0900TimeOffset = timezone.plus0900.timeOffSet[1]
        plus0700TimeOffset = timezone.plus0700.timeOffSet[1]
      })
  })

  context(Story.generalSettingTimezone, () => {
    it('Course Learner in Phnom Penh able to see timezone tooltips on book course schedule details', () => {
      Story.ticket('QA-1342')
      courseDetail.loginAsCourseLearnerInPhnomPenh()
      booking.accessToCourseDetail()
      courseDetail.clickScheduleDetailsBy(courseTimezone.selfStudy.type)
      courseDetail.verifyTooltipForVirtualClassActivityInScheduleDetails(
        courseActivities.virtualClass.title,
        plus0700TimeOffset,
        plus0900TimeOffset
      )
      courseDetail.verifyTooltipForPhysicalClassActivityInScheduleDetails(
        courseActivities.physicalClass.title,
        plus0900TimeOffset
      )
    })
  })
})
