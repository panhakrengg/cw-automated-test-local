class EmailApiPrd {
  findEmailByScreenName(screenName, removeExists) {
    cy.loginEthereal(screenName)
    cy.task('getE').its('html').as('getReceivedEmail')
    if (removeExists) cy.task('deleteSeenEmails')
  }
  findEmailBySubjectCount(screenName, subject, removeExists) {
    cy.loginEthereal(screenName)
    cy.task('searchEmail', { subject }).its('html').as('getReceivedEmail')
    if (removeExists) cy.task('deleteSeenEmails')
  }
  getEmailSubjectBy(screenName) {
    cy.loginEthereal(screenName)
    cy.task('getE')
      .then((object) => console.log(object))
      .its('subject')
      .as('getReceivedEmailSubject')
  }
}

export default EmailApiPrd
