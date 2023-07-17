import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import CertificateAction from '../../../../classes/lms/admin/settings/course-certificate/actions/CertificateAction'
import CertificateAssertion from '../../../../classes/lms/admin/settings/course-certificate/assertions/CertificateAssertion'
import CertificateBase from '../../../../classes/lms/admin/settings/course-certificate/base/CertificateBase'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Faker from '../../../../classes/utilities/Faker'
import LmsUserRole from '../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  let courseId,
    fullCatalogCourseInstanceUrlAfterEditing,
    certificateInfo,
    defaultCertificateContent,
    learnerInfo,
    learnerBeforeEditedCourseDetailUrl,
    learnerAfterEditedCourseDetailUrl

  const baseCourseInstance = new BaseCourseInstance()
  const certificateBase = new CertificateBase()
  const certificateAction = new CertificateAction()
  const certificateAssertion = new CertificateAssertion()

  const faker = new Faker()

  before(() => {
    certificateBase.certificateYaml.getCourseFuncEditDefaultCertificate((data) => {
      certificateInfo = data
      faker.setPathFixture(certificateInfo)
      courseId = faker.getUrlId()

      faker.setPathFixture(certificateInfo.funcInstanceAwardedBeforeEditing)
      baseCourseInstance.setCourseAndInstanceId(courseId, faker.getUrlId())
      learnerBeforeEditedCourseDetailUrl = baseCourseInstance.getMemberCourseDetailUrl()

      faker.setPathFixture(certificateInfo.funcInstanceNewCompleteAfterEditing)
      baseCourseInstance.setCourseAndInstanceId(courseId, faker.getUrlId())
      learnerAfterEditedCourseDetailUrl = baseCourseInstance.getMemberCourseDetailUrl()
      fullCatalogCourseInstanceUrlAfterEditing = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
        OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
        'people'
      )
    })
    certificateBase.certificateYaml.getCertificateDefaultContent((data) => {
      defaultCertificateContent = data
    })

    certificateBase.certificateYaml.getUserInfo(
      LmsUserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_MALLORY,
      (data) => {
        learnerInfo = data
      }
    )
  })

  context(Story.courseCertificate, () => {
    it('Learning admin edit default certificate then Org learner check awarded a certificate & complete new course', () => {
      Story.ticket('QA-1866')
      certificateBase.login.toCertificateSettingsAsLearningAdminEmery(
        `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/settings`
      )

      cy.logInTestCase('Reset Certificate Content')
      certificateAction.clickCertificateNav()
      certificateAction.clickEditCertificateLink()
      certificateAction.updateCertificateContent(defaultCertificateContent)
      certificateAction.clickSave()

      cy.logInTestCase('Update Certificate Content As a Learning Admin')
      certificateAction.updateCertificateContent(defaultCertificateContent, false)
      certificateAction.clickSave()

      cy.logInTestCase('Learning Admin add Learner to Instance')
      certificateAction.visitCourseInstancePeopleTab(fullCatalogCourseInstanceUrlAfterEditing)
      certificateAction.removeLearnerIfExists(learnerInfo.email)
      cy.wait(3000)
      certificateAction.addLearner(learnerInfo.screenName)

      cy.logInTestCase('Learning Admin Change Learning Status')
      certificateAction.changeLearningStatusOfLearner(learnerInfo.email)

      cy.logInTestCase('Learner visit before certificate edited course detail')
      certificateBase.login.toCourseDetailAsInstanceMemberMallory(
        learnerBeforeEditedCourseDetailUrl
      )
      certificateAction.downloadCertificate()
      certificateAssertion.verifyCertificate()

      cy.logInTestCase('Learner visit after certificate edited course detail')
      cy.visit(learnerAfterEditedCourseDetailUrl)
      certificateAction.takeCourseActivity()
      cy.reload()
      certificateAction.downloadCertificate()
      certificateAssertion.verifyCertificate()
    })
  })
})
