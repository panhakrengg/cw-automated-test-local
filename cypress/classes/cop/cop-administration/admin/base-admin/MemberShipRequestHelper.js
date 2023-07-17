import Environment from '../../../../base/Environment'
import WebNotification from '../../../../notification/WebNotification'
import SignInAsCoP from '../../base-administration/SignInAsCoP'
import { RequestAccess } from '../../Home/request-access/RequestAccess'
import { ManageMembers } from '../manage-members/ManageMembers'
import { ManageMembersAssertions } from '../manage-members/ManageMembersAssertions'
import { MemberRequests } from '../member-requests/MemberRequests'
import { MemberRequestsAssertions } from '../member-requests/MemberRequestsAssertions'
import { BaseAdminAssertions } from './BaseAdminAssertions'
import { InterceptActionRequest } from './InterceptActionRequest'

export class MemberShipRequestHelper {
  manageMembers = new ManageMembers()
  memberRequests = new MemberRequests()
  requestAccess = new RequestAccess()
  memberRequestsAssertions = new MemberRequestsAssertions()
  manageMembersAssertions = new ManageMembersAssertions()
  baseAdminAssertions = new BaseAdminAssertions()
  webNotification = new WebNotification()
  signInAsCoP = new SignInAsCoP()
  environment = new Environment()

  loginAsAdminKendal(redirectUrl = '/') {
    InterceptActionRequest.itcAdminFetchManageMember.set()
    this.signInAsCoP.admin_Kendal(redirectUrl)
    InterceptActionRequest.itcAdminFetchManageMember.wait()
  }

  removeUserFromCop(email) {
    this.manageMembers.removeMemberIfExistWith(email)
    this.manageMembers.accessMemberRequestPage()
    this.memberRequests.removeMemberRequestsIfExistWith(email)
  }

  requestAccessToJoinCop(copUrl, user) {
    cy.visit(copUrl)
    this.requestAccess.clickButtonRequestToJoinCommunity()
    if (user) {
      this.requestAccess.fillInInformation(user)
    }
    this.requestAccess.submitRequestToJoinCommunity()
  }

  acceptRequestToJoinCop(firstName, copName) {
    cy.wait(6000) // UAT is slow
    this.webNotification.acceptRequestToJoinCopByNotificationBody(
      `${firstName} requested to access ${copName}.`
    )
    cy.reload()
  }

  verifyCwUserBecomeCopMember(email) {
    this.manageMembersAssertions.verifyMemberAsCwUserExistInTableWith(email)
    this.manageMembers.accessMemberRequestPage()
    this.memberRequestsAssertions.verifyMemberNotExistInTableWith(email)
  }

  verifyNonCwUserBecomeCopMember(email) {
    this.manageMembersAssertions.verifyMemberAsNonCwUserExistInTableWith(email)
    this.manageMembers.accessMemberRequestPage()
    this.memberRequestsAssertions.verifyMemberNotExistInTableWith(email)
  }

  verifyApprovalToJoinCopEmailTemplateForNonCwUser(user, copName) {
    this.baseAdminAssertions.verifyApproveToJoinCopEmailTemplate(user, copName, true)
    this.baseAdminAssertions.verifyRegistrationPage(copName, user)
  }

  verifyApprovalToJoinCopEmailTemplateForCwUser(user, copName) {
    this.baseAdminAssertions.verifyApproveToJoinCopEmailTemplate(user, copName)
  }

  expectToReceiveApprovalToJoinCopNotification(userName, copName) {
    this.webNotification.clickOnWebNotificationIcon()
    this.webNotification.getTheLastNotificationItem()
    this.webNotification.verifyBodyContainContent(
      `${userName} approved your request to access ${copName}.`
    )
    this.webNotification.deleteTheLastNotificationItem()
  }
}
