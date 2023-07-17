import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import CertificateBase from '../../../../classes/lms/admin/settings/course-certificate/base/CertificateBase'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Faker from '../../../../classes/utilities/Faker'
import LmsUserRole from '../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  let courseId, fullCatalogCourseUrl, courseInfo, learnerInfo, courseInstanceUrl

  const baseCourseInstance = new BaseCourseInstance()
  const certificateBase = new CertificateBase()
  const faker = new Faker()

  before(() => {
    certificateBase.certificateYaml.getCourseFuncDisableCertificate((data) => {
      courseInfo = data
      faker.setPathFixture(courseInfo)
      courseId = faker.getUrlId()

      faker.setPathFixture(courseInfo.funcInstanceCompletedNoCertificate)
      baseCourseInstance.setCourseAndInstanceId(courseId, faker.getUrlId())
      courseInstanceUrl = baseCourseInstance.getMemberCourseDetailUrl()
      fullCatalogCourseUrl = baseCourseInstance.getOrgCatalogCourseUrl(
        OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
        'edit-course'
      )
    })

    certificateBase.certificateYaml.getUserInfo(
      LmsUserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_MALLORY,
      (data) => {
        learnerInfo = data
      }
    )
  })

  context(Story.courseCertificate, () => {
    it('Course Admin can disable course completion', () => {
      Story.ticket('QA-2056')
      certificateBase.login.toCourseOverviewAsCourseAdminTressie(fullCatalogCourseUrl)

      cy.logInTestCase('Reset Award Course Completion Certificate')
      certificateBase.certificateAction.enableAwardCourseCompletionCertificateIfDisabled()

      cy.logInTestCase('Course Admin Disable Course Completion Certificate')
      certificateBase.certificateAction.disableAwardCourseCompletionCertificate()

      cy.logInTestCase('Learner visit course instance overview')
      certificateBase.login.toCourseDetailAsInstanceMemberMallory(courseInstanceUrl)
      certificateBase.certificateAssertion.expectCertificateIsNotVisible()

      cy.logInTestCase('Learner visit my profile expertise tab')
      certificateBase.certificateAction.visitMyProfileExpertiseAndQualificationTab()
      certificateBase.certificateAssertion.expectCertificateIsNotListed(courseInfo.name.value)
    })
  })
})
