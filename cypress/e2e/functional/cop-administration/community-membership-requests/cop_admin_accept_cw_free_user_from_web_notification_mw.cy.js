import { MemberShipRequestHelper } from '../../../../classes/cop/cop-administration/admin/base-admin/MemberShipRequestHelper'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import QueryCoPUserInfo from '../../../../classes/cop/cop-administration/base-administration/QueryCoPUserInfo'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, { retries: 1 }, () => {
  const coPAdminMock = new CoPAdminMock()
  const memberShipRequestHelper = new MemberShipRequestHelper()
  const queryCoPUserInfo = new QueryCoPUserInfo()

  context(Story.communityMemberShipRequests, () => {
    let freemiumFunc
    let freemiumUserEmail
    let copName
    let copHomeUrl
    let copAdminUrl
    let adminScreenName

    before(() => {
      coPAdminMock.setCommunityMembership()
      cy.stubUser(UserRole.CW_USERS.FREEMIUM_FUNC)
      cy.get('@stubUser').then((user) => {
        freemiumFunc = user
        freemiumUserEmail = freemiumFunc.email
      })
      queryCoPUserInfo.setCoPUser()
    })

    beforeEach(() => {
      adminScreenName = queryCoPUserInfo._adminKendalScreenName()
      copName = coPAdminMock.getMwCoPCanJoinName()
      copHomeUrl = coPAdminMock.getMwCoPCanJoinHomeUrl()
      copAdminUrl = coPAdminMock.getMwCoPCanJoinAdminUrl()
    })

    it('CoP Admin accept cw free user from Web notification the user check email&web notification - MW', () => {
      Story.ticket('QA-603', ['CW-17541'])
      Cypress.on('uncaught:exception', () => false)

      cy.logInTestCase('Log in and reset data')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      memberShipRequestHelper.removeUserFromCop(freemiumUserEmail)

      cy.logInTestCase('Non CW user request to join MW cop')
      SignInAs.freemiumFuncUser()
      memberShipRequestHelper.requestAccessToJoinCop(copHomeUrl)

      cy.logInTestCase('Admin accept request access to join cop')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      cy.wait(6000) // UAT is slow
      memberShipRequestHelper.acceptRequestToJoinCop(freemiumFunc.screenName, copName)

      cy.logInTestCase('Verify admin check member is added to list')
      memberShipRequestHelper.verifyCwUserBecomeCopMember(freemiumUserEmail)

      cy.logInTestCase('Verify approval to join cop email template')
      SignInAs.freemiumFuncUser()
      memberShipRequestHelper.verifyApprovalToJoinCopEmailTemplateForCwUser(freemiumFunc, copName)
      memberShipRequestHelper.expectToReceiveApprovalToJoinCopNotification(adminScreenName, copName)
    })
  })
})
