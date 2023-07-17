import ActivityLogs from '../../../../classes/account/ActivityLogs'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import ConsentConstant from '../../../../classes/account/consents/personnel-consent/ConsentConstant'
import CoursesConsent from '../../../../classes/account/consents/personnel-consent/CoursesConsent'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const ALL_ACTIVITIES = ActivityCategories.ALL_ACTIVITIES

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()
  const consentSettings = new ConsentSettings()
  const coursesConsent = new CoursesConsent()
  const courseDetail = new CourseDetail()
  const faker = new Faker()

  let auAcMemberName
  let ccForSmokeActivityLog
  let consentForm
  let courseInstanceId

  before(() => {
    yamlHelper
      .read()
      .its('Users.uat')
      .then((user) => {
        const auAcMember = user.auAcMember
        auAcMemberName = auAcMember.familyName + ' ' + auAcMember.givenName
        cy.wrap(auAcMemberName).as('learner')
      })
    accountYamlHelper
      .read()
      .its('Courses')
      .then((course) => {
        ccForSmokeActivityLog = course.ccForSmokeActivityLog
        faker.setPathFixture(ccForSmokeActivityLog.courseInstances.selfStudy)
        courseInstanceId = faker.getUrlId()
        consentForm = ccForSmokeActivityLog.consent
        cy.wrap(consentForm).as('consentFormName')
      })
  })

  beforeEach(() => {
    activityLogs.setPersonalCourseLogData(auAcMemberName, consentForm, ccForSmokeActivityLog.title)
  })

  function givenCourseConsent() {
    cy.visit(`/web/ci${courseInstanceId}/course-detail`)
    courseDetail.itcFetchCourseCatalogActivities.set()
    cy.clickAgreeConsentFormButton()
    courseDetail.itcFetchCourseCatalogActivities.wait()
  }

  context(Story.activityTrainingAndDevelopment, () => {
    after(() => {
      ReportDefect.markCwDefect('Blank page after given consent')
    })
    it('Learner able to see a gave consent log of a course ', () => {
      Story.ticket('QA-1043', ['CW-17127'])
      cy.log('User give consent')
      AccountUserStub.signInAsAuAcMember()
      givenCourseConsent()

      cy.logInTestCase('Verify given consent log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(ALL_ACTIVITIES)
      activityLogs.expectFoundGaveCourseConsent(ccForSmokeActivityLog.title)
    })
  })

  context(Story.activityTrainingAndDevelopment, () => {
    it('Learner able to see revoke consent log of a course', () => {
      Story.ticket('QA-1045')
      cy.log('Navigate to training and development activity log')
      AccountUserStub.signInAsAuAcMember()

      cy.logInTestCase('Redirect to consent in account settings')
      consentSettings.visit()
      coursesConsent.accessConsentTab(ConsentConstant.consentTabs[1].name)

      cy.logInTestCase('Revoke course consent')
      consentSettings.getConsentItem(ccForSmokeActivityLog.title)
      consentSettings.revokeConsent()

      cy.logInTestCase('Verify consent log in all category')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(ALL_ACTIVITIES)
      activityLogs.expectFoundRevokeCourseConsent(ccForSmokeActivityLog.title)
    })
  })
})
