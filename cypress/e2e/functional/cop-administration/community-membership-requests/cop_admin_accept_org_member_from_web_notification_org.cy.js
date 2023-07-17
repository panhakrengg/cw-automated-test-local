import { MemberShipRequestHelper } from '../../../../classes/cop/cop-administration/admin/base-admin/MemberShipRequestHelper'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const memberShipRequestHelper = new MemberShipRequestHelper()

  context(Story.communityMemberShipRequests, () => {
    let orgMember
    let orgMemberEmail
    let copName
    let copHomeUrl
    let copAdminUrl
    let adminUser

    before(() => {
      coPAdminMock.setCommunityMembership()
      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat.auOrgMember_Arielle')
        .then((data) => {
          orgMember = data
          orgMemberEmail = orgMember.email
        })
      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat.copAdmin_Kendal')
        .then((data) => {
          adminUser = data
        })
    })

    beforeEach(() => {
      copName = coPAdminMock.getOCoPCanJoinName()
      copHomeUrl = coPAdminMock.getOCoPCanJoinHomeUrl()
      copAdminUrl = coPAdminMock.getOCoPCanJoinAdminUrl()
    })

    it('CoP Admin accept org member from Web notification the user check email&web notification - Org CoP', () => {
      Story.ticket('QA-619')
      Cypress.on('uncaught:exception', () => false)

      cy.logInTestCase('Log in and reset data')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      memberShipRequestHelper.removeUserFromCop(orgMemberEmail)
      cy.signOut()

      cy.logInTestCase('Non CW user request to join MW cop')
      SignInAs.member_Arielle()
      memberShipRequestHelper.requestAccessToJoinCop(copHomeUrl)

      cy.logInTestCase('Admin accept request access to join cop')
      memberShipRequestHelper.loginAsAdminKendal(copAdminUrl)
      memberShipRequestHelper.acceptRequestToJoinCop(orgMember.fullName, copName)

      cy.logInTestCase('Verify admin check member is added to list')
      memberShipRequestHelper.verifyCwUserBecomeCopMember(orgMemberEmail)

      cy.logInTestCase('Verify approval to join cop email template')
      SignInAs.member_Arielle()
      memberShipRequestHelper.verifyApprovalToJoinCopEmailTemplateForCwUser(orgMember, copName)
      memberShipRequestHelper.expectToReceiveApprovalToJoinCopNotification(
        adminUser.fullName,
        copName
      )
    })
  })
})
