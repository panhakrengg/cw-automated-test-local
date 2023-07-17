Cypress.Commands.add('getGlobalProfileImage', () => {
  return cy.get('#global-navigation-profile-image')
})

Cypress.Commands.add('seeDefaultImageInGlobalProfileImage', () => {
  cy.getGlobalProfileImage()
    .should('be.visible')
    .invoke('attr', 'src')
    .then(($src) => {
      console.log($src)
      cy.getExtractUrlFromContent($src).then(($url) => {
        cy.request($url.href).its('status').should('eq', 200)
        expect($url.searchParams.get('img_id_token')).to.equal(
          '6RO9J%2FC8R8PbPtwiemIfR%2BrOqPY%3D'
        )
      })
    })
})

Cypress.Commands.add('getCurrentLoginUserScreenName', () => {
  return cy.get('#avatar-dropdown ul > li > span').eq(0).invoke('text')
})

Cypress.Commands.add('isSuccessResponseImage', (url) => {
  return cy.request(`${url}`).its('status').should('eq', 200)
})
