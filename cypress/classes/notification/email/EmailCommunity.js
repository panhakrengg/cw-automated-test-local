class EmailCommunity {
  name

  constructor(name) {
    this.name = name
  }

  getInvitationSubject() {
    return `Invitation Notification`
  }
  getReminderInvitationSubject() {
    return `Reminder Notification`
  }
  getOrgInvitationSubject() {
    return `FireCloud Zone - Invitation Notification`
  }
  getOrgReminderInvitationSubject() {
    return `FireCloud Zone - Reminder Notification`
  }
  getInvitationHeader() {
    return `Invitation to join ${this.name}`
  }
  getReminderInvitationHeader() {
    return `Reminder: Invitation to join ${this.name}`
  }
  getReminderNonCwUserInvitationHeader() {
    return `Reminder: Create an account to join ${this.name}`
  }
  getSalute(userName) {
    return `Dear ${userName},`
  }
  getInvitationBody() {
    return `You have been invited to join ${this.name} Community.`
  }
  getReminderNonCwUserInvitationBody() {
    return `You are invited to join the Community of Purpose: ${this.name}. Create an account to join our community.`
  }
  getInvitationButton() {
    return `Accept with existing account`
  }
  getApprovalEmailSubject() {
    return `Approval Notification`
  }
  getApprovalEmailHeader() {
    return `${this.name}'s Community Notification`
  }
  getPersonalNote(note) {
    return `Personal note: ${note}`
  }
  getAcceptInvitationInfo() {
    return `To accept this invitation and join this community, you can either create a new account or use your existing account.`
  }
}

export default EmailCommunity
