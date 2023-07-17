import Epic from '../../../../classes/Epic'
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
    it('Course Administrator able to see a predefined consent use in course', () => {
      Story.ticket('QA-1177')
      new SignInLmsAs().couAdmin_Tressie()
      new ManageConsent().resetAndProcessBookCourseConsent(
        lmUser.getCouAdminEmail_Tressie(),
        courseYamlStub
      )
    })
  })
})
