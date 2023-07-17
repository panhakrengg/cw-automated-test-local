import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import CertificateAction from '../../../../classes/lms/admin/settings/course-certificate/actions/CertificateAction'
import CertificateAssertion from '../../../../classes/lms/admin/settings/course-certificate/assertions/CertificateAssertion'
import CertificateBase from '../../../../classes/lms/admin/settings/course-certificate/base/CertificateBase'
import CertificateConstant from '../../../../classes/lms/admin/settings/course-certificate/constants/CertificateConstant'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Faker from '../../../../classes/utilities/Faker'
import LmsUserRole from '../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  let courseId, fullCatalogCourseInstanceUrl, courseInfo, learnerInfo, courseInstanceUrl

  const baseCourseInstance = new BaseCourseInstance()
  const certificateBase = new CertificateBase()
  const certificateAction = new CertificateAction()
  const certificateAssertion = new CertificateAssertion()

  const faker = new Faker()

  before(() => {
    certificateBase.certificateYaml.getCourseFuncModifyLanguage((data) => {
      courseInfo = data
      faker.setPathFixture(courseInfo)
      courseId = faker.getUrlId()

      faker.setPathFixture(courseInfo.funcInstanceViewLanguage)
      baseCourseInstance.setCourseAndInstanceId(courseId, faker.getUrlId())
      courseInstanceUrl = baseCourseInstance.getMemberCourseDetailUrl()
      fullCatalogCourseInstanceUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
        OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
        'people'
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
    it('Learning admin add multiple Language for the Certificate', () => {
      Story.ticket('QA-1878')
      certificateBase.login.toCertificateSettingsAsLearningAdminEmery(
        `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/settings`
      )

      cy.logInTestCase('Reset Certificate Language')
      certificateAction.clickCertificateNav()
      certificateAction.clickEditCertificateLink()
      certificateAction.removeCertificateLanguageIfExists(CertificateConstant.ITALIAN_SWITZERLAND)
      certificateAction.clickSave()

      cy.logInTestCase('Learning Admin Add Certificate Language')
      certificateAction.addCertificateLanguageIfNotExists(CertificateConstant.ITALIAN_SWITZERLAND)
      certificateAction.clickSave()

      cy.logInTestCase('Learning Admin add Learner to Instance')
      certificateAction.visitCourseInstancePeopleTab(fullCatalogCourseInstanceUrl)
      certificateAction.removeLearnerIfExists(learnerInfo.email)
      cy.wait(3000)
      certificateAction.addLearner(learnerInfo.screenName)

      cy.logInTestCase('Learning Admin Change Learning Status')
      certificateAction.changeLearningStatusOfLearner(
        learnerInfo.email,
        CertificateConstant.COMPLETED
      )

      cy.logInTestCase('Learner visit course instance overview')
      certificateBase.login.toCourseDetailAsInstanceMemberMallory(courseInstanceUrl)
      certificateAssertion.expectCertificateLanguageExist(CertificateConstant.ITALIAN_SWITZERLAND)
    })
  })
})
