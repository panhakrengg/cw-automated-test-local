import Epic from '../../../../classes/Epic'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import InstanceOverview from '../../../../classes/lms/admin/course-instance/InstanceOverview'
import ModifyCourseInstance from '../../../../classes/lms/admin/course/ModifyCourseInstance'
import AdditionalInformation from '../../../../classes/lms/base-manage-course/AdditionalInformation'
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
  const instanceOverview = new InstanceOverview()
  const modifyCourseInstance = new ModifyCourseInstance()
  let additionalInformation

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseName
    let courseInstance

    before(() => {
      new YamlHelper('lms-admin/course-instance/create-new-instances')
        .read()
        .then(({ CreateInstances }) => {
          course = CreateInstances.courseFuncForNewInstance
          courseInstance = course.instanceWithoutTitle
          courseName = course.name.value

          faker.setPathFixture(course)
          courseId = faker.getUrlId()
          faker.setPathFixture(course)
          courseId = faker.getUrlId()
        })
    })

    beforeEach(() => {
      copManageInstance.setInstance(courseInstance)
      additionalInformation = new AdditionalInformation(courseInstance)
    })
    it('Course Admin creates a course instance without title then Learner view', () => {
      Story.ticket('QA-1807')
      signInLmsAs.couAdmin_Tressie()

      cy.logInTestCase('Remove existing course instance')
      learningAdmin.accessFireCloudCourseDetailBy(courseId)
      cy.wait(3000)
      copManageInstance.archiveAllInstancesBy(courseInstance.date)
      copManageInstance.deleteAllArchiveInstancesBy(courseInstance.date)

      cy.logInTestCase('Admin')
      modifyCourseInstance.createNewCourseInstanceAndPublish(courseInstance, courseName)
      additionalInformation._expectToSeeAdditionInfo()
      instanceOverview.verifyInstanceDetails(courseInstance, course)
      copManageInstance.clickOnBackIcon()
      cy.wait(3000)
      copManageInstance.expectToSeeInstanceByDate(courseInstance.date)

      cy.logInTestCase('Member')
      signInLmsAs.ctgMember_Quentin()
      courseCatalog.visitCourseDetail(courseId)
      courseDetail.verifyUnBookInstanceInfo(courseInstance)
    })
  })
})
