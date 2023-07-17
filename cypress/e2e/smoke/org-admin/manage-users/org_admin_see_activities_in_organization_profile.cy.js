import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import InterceptReq from '../../../../classes/base/InterceptReq'
import ManageUser from '../../../../classes/org-management/ManageUser'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const manageUser = new ManageUser()
  const itcActivityLog = new InterceptReq('/organization/search/activity_log', 'ActivityLog')

  let screenName

  beforeEach(() => {
    manageUser.setItc()

    cy.visitThenSignIn(manageUser.pageUrl(), UserRole.ORG_ADMIN.ORGANIZATION)
    cy.stubUser(UserRole.ORG_ADMIN.ORGANIZATION)
    cy.get('@stubUser').then((user) => {
      screenName = user.screenName
    })
  })

  context(Story.manageUsers, () => {
    it('Org Admin able to see activities in organization Profile', () => {
      Story.ticket('QA-461')
      manageUser.searchMemberByName(screenName)
      itcActivityLog.set()
      manageUser.showMemberTableFirstRowOnAction('View activity log')
      itcActivityLog.wait()
      cy.wait(100)
      cy.get('.activity-log-list').within(($wrapper) => {
        cy.wrap($wrapper).should('be.visible')
        cy.wrap($wrapper).get('thead > :nth-child(1)').should('contain.text', 'Date')
        cy.wrap($wrapper).get('thead > :nth-child(2)').should('contain.text', 'User')
        cy.wrap($wrapper).get('thead > :nth-child(3)').should('contain.text', 'Activity')
        cy.wrap($wrapper).get('thead > :nth-child(4)').should('contain.text', 'Recipient')
        cy.wrap($wrapper)
          .get('tbody > :nth-child(1) > :nth-child(1)', {
            timeout: 30000,
          })
          .click()
        cy.wrap($wrapper)
          .parents('body')
          .find('.swal2-container')
          .within(($popup) => {
            cy.wrap($popup).should('be.visible')
            cy.wrap($popup).get('.swal2-header > button').click()
            cy.wrap($wrapper).parents('body').find('a.text-black > .lexicon-icon').click()
          })
      })
    })
  })
})
