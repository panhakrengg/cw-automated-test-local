export default class HomeQuery {
  getButtonAcceptInvitation() {
    return cy.get('a:contains("Accept Invitation")').first()
  }
}
