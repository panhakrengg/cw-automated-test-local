import HomeQuery from '../queries/HomeQuery'

export default class HomeAssertion extends HomeQuery {
  expectToSeeButtonAcceptInvitation() {
    super.getButtonAcceptInvitation().should('be.visible').and('have.attr', 'href')
  }
}
