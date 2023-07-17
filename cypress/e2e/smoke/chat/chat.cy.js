// describe.skip('Given Role Use chat', () => {
//   beforeEach(() => {
//     cy.visitThenSignIn(
//       '/u/home/dashboard',
//       'OrgMgtUsers.orgMgt.admins.organization'
//     )
//     cy.intercept('/web/guest/messaging*').as('interceptMessage')
//     cy.get('.cw-private-messaging > a > .cw-icon').click()
//     cy.wait('@interceptMessage')
//   })

//   it('show mini chat main', () => {
//     cy.get('.cw--messaging-mini-chat-main').compareSnapshot(
//       'mini-chat-main',
//       Cypress.env('snapShot').threshold
//     )
//     cy.get('.cw--messaging-mini-chat-main').compareMobileSnapshot(
//       'mini-chat-main'
//     )
//     cy.get('.cw--messaging-mini-chat-main').compareTabletSnapshot(
//       'mini-chat-main'
//     )
//   })

//   it('show full chat main', () => {
//     cy.get(
//       '.cw--messaging-header > .cw--box > .cw--chat-toolbar > .cw--row > :nth-child(3) > .cw--container > .d-none'
//     ).click()
//     cy.get('.cw--messaging-row').compareSnapshot(
//       'full-chat-main',
//       Cypress.env('snapShot').threshold
//     )
//     cy.get('.cw--messaging-row').compareMobileSnapshot('full-chat-main')
//     cy.get('.cw--messaging-row').compareTabletSnapshot('full-chat-main')
//   })
// })
