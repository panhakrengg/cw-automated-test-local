Cypress.Commands.add('htmlVideoCanPlay', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject)
    .get('video')
    .should('have.prop', 'paused', true)
    .and('have.prop', 'ended', false)
    .then(($video) => {
      $video[0].play()
    })
    .should('have.prop', 'paused', false)
    .and('have.prop', 'ended', false)
})
Cypress.Commands.add(
  'htmlVideoHasEnded',
  { prevSubject: 'optional' },
  (subject, playbackRate, timeout) => {
    cy.wrap(subject)
      .get('video')
      .then(($video) => {
        $video[0].playbackRate = playbackRate
        $video[0].play()
      })
    cy.wrap(subject).get('video', { timeout: timeout }).and('have.prop', 'ended', true)
  }
)
Cypress.Commands.add('htmlVideoHasDuration', { prevSubject: 'optional' }, (subject, duration) => {
  cy.wrap(subject).get('video').should('have.prop', 'duration', duration)
})
Cypress.Commands.add('htmlVideoResponseSuccess', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject)
    .get('video source')
    .invoke('attr', 'src')
    .then(($src) => {
      cy.request($src).its('status').should('eq', 200)
    })
})
Cypress.Commands.add('expectHtmlVideoOfType', { prevSubject: 'optional' }, (subject, type) => {
  cy.wrap(subject)
    .get('video source')
    .invoke('attr', 'type')
    .then(($type) => {
      expect($type).to.be.eq(type)
    })
})
