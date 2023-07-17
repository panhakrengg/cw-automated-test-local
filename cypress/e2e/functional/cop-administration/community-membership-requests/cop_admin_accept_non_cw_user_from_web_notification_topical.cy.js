import { MemberShipRequestHelper } from '../../../../classes/cop/cop-administration/admin/base-admin/MemberShipRequestHelper'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import { NonCWUsersMock } from '../../../../classes/utilities/NonCWUsersMock'

describe(Epic.CoPAdministration, { retries: 1 }, () => {
  const coPAdminMock = new CoPAdminMock()
  const memberShipRequestHelper = new MemberShipRequestHelper()
  const nonCWUsersMock = new NonCWUsersMock()

  context(Story.communityMemberShipRequests, () => {
    let nonCWUser
    let nonCWUserEmail
    let copName
    let copHomeUrl
    let copAdminUrl

    before(() => {
      coPAdminMock.setCommunityMembership()
      nonCWUsersMock.getNonCwUser03().then((data) => {
        nonCWUser = data
        nonCWUserEmail = nonCWUser.email
      })
    })

    beforeEach(() => {
      copName = coPAdminMock.getTPCoPCanJoinName()
      copHomeUrl = coPAdminMock.getTPCoPCanJoinHomeUrl()
      copAdminUrl = coPAdminMock.getTPCoPCanJoinAdminUrl()
    })

    it('CoP Admin accept non-cw user from Web notification the user check email notification - Topical', () => {
      Story.ticket('QA-616')
      Cypress.on('uncaught:exception', () => false)

      cy.logInTestCase('Log in and reset data')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      memberShipRequestHelper.removeUserFromCop(nonCWUserEmail)
      cy.signOut()

      cy.logInTestCase('Non CW user request to join Topical cop')
      memberShipRequestHelper.requestAccessToJoinCop(copHomeUrl, nonCWUser)

      cy.logInTestCase('Admin accept request access to join cop')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      memberShipRequestHelper.acceptRequestToJoinCop(nonCWUser.firstName, copName)

      cy.logInTestCase('Verify admin check member is added to list')
      memberShipRequestHelper.verifyNonCwUserBecomeCopMember(nonCWUserEmail)

      cy.logInTestCase('Verify approval to join cop email template')
      memberShipRequestHelper.verifyApprovalToJoinCopEmailTemplateForNonCwUser(nonCWUser, copName)
    })
  })
})
