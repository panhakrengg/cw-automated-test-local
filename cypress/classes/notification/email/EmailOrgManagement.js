import { OrgConst } from '../../org-management/base-org-management/OrgStub'

class EmailOrgManagement {
  static ORGANIZATION_NAME = OrgConst.NAME
  static INVITE_EMAIL_SUBJECT = `Invitation to join ${this.ORGANIZATION_NAME} organization`
  static INVITE_EMAIL_BODY = `You've been invited to join the ${this.ORGANIZATION_NAME} organization`
  static INVITE_EMAIL_CUSTOM_BODY = `Custom Email Invite users`
}

export default EmailOrgManagement
