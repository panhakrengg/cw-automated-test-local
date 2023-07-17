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
    it('Course Facilitator able to see a predefined consent use in course', () => {
      Story.ticket('QA-1966')
      new SignInLmsAs().couFaci_Joanie()
      new ManageConsent().resetAndProcessBookCourseConsent(
        lmUser.getCouFaciEmail_Joanie(),
        courseYamlStub
      )
    })
  })
})
