import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import LmsUserYamlStub from '../../../../classes/lms/stub/LmsUserYamlStub'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import PredefineConsentCourseYamlStub from '../../../../classes/org-management/org-admin/stub/PredefineConsentCourseYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const lmUser = new LmsUserYamlStub()
  const courseYamlStub = new PredefineConsentCourseYamlStub()

  before(() => {
    lmUser.setData()
    courseYamlStub.setData()
  })

  context(Story.orgAdminManageConsents, () => {
    it('Course Member able to see a predefined consent use in course', () => {
      Story.ticket('QA-1964')
      new SignInLmsAs().couMember_Litzy()

      new Learning().visitThenWithdrawByInstanceName(
        courseYamlStub.getCourseName(),
        courseYamlStub.getInstanceName()
      )

      new ManageConsent().bookThenExpectSeePredefinedConsent(
        courseYamlStub.getCourseId(),
        courseYamlStub.getInstanceName(),
        courseYamlStub.getConsentBaseYaml()
      )
    })
  })
})
