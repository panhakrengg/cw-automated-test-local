import Epic from '../../../../classes/Epic'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import InstanceOverview from '../../../../classes/lms/admin/course-instance/InstanceOverview'
import ModifyCourseInstance from '../../../../classes/lms/admin/course/ModifyCourseInstance'
import CourseCatalog from '../../../../classes/lms/CourseCatalog'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LearningAdmin from '../../../../classes/lms/LearningAdmin'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const learningAdmin = new LearningAdmin()
  const copManageInstance = new CopManageInstance()
  const faker = new Faker()
  const courseCatalog = new CourseCatalog()
  const courseDetail = new CourseDetail()
  const modifyCourseInstance = new ModifyCourseInstance()
  const instanceOverview = new InstanceOverview()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseName
    let courseInstanceName
    let courseInstance

    before(() => {
      new YamlHelper('lms-admin/course-instance/create-new-instances')
        .read()
        .then(({ CreateInstances }) => {
          course = CreateInstances.courseFuncForNewInstance
          courseInstance = course.instanceWithAllInfo
          courseName = course.name.value
          courseInstanceName = courseInstance.title.value

          faker.setPathFixture(course)
          courseId = faker.getUrlId()
          faker.setPathFixture(course)
          courseId = faker.getUrlId()
        })
    })

    it('Course Admin creates a Course instance with all info then Learner view', () => {
      Story.ticket('QA-199')

      cy.logInTestCase('Remove existing course instance')
      signInLmsAs.couAdmin_Tressie()
      learningAdmin.accessFireCloudCourseDetailBy(courseId)
      copManageInstance.archiveInstanceByTitle(courseInstanceName)
      copManageInstance.deleteArchiveInstancesByTitle(courseInstanceName)

      cy.logInTestCase('Admin')
      modifyCourseInstance.createNewCourseInstanceAndPublish(courseInstance, courseName)
      instanceOverview.verifyInstanceDetails(courseInstance, course)
      copManageInstance.clickOnBackIcon()
      cy.wait(3000)
      copManageInstance.expectToSeeInstanceInManageInstance(courseInstanceName)

      cy.logInTestCase('Member')
      signInLmsAs.ctgMember_Quentin()
      courseCatalog.visitCourseDetail(courseId)
      courseDetail.clickScheduleDetailsByInstanceTitle(courseInstanceName)
      courseDetail.verifyScheduleDetailPopup(courseInstance)
      courseDetail.verifyUnBookInstanceInfo(courseInstance)
    })
  })
})
