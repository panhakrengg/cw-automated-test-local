const YAML = require('yamljs')
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe('Org-Admin', { retries: 1 }, () => {
  context('Manage Users - 3 dots option', () => {
    const manageUsers = new ManageUsers()
    let viewOrgProfile

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        const { uat } = YAML.parse(OrgMgtUsersString).Users
        viewOrgProfile = uat.viewOrgProfile
      })
    })

    it('Org Admin Update Public Profile detail on a member', () => {
      Story.ticket('QA-382')

      manageUsers.findUserRowByAdmin(viewOrgProfile.email)
      manageUsers.openViewOrgProfilePopup()
      manageUsers.defineAliasesForOrgProfile()
      const profileInfo = {
        firstName: viewOrgProfile.givenName,
        lastName: viewOrgProfile.familyName,
        email: viewOrgProfile.email,
        jobTitle: '',
      }
      const modProfileInfo = {
        firstName: `AUFirstName${manageUsers._postFix}`,
        lastName: `AULastName${manageUsers._postFix}`,
        email: `${manageUsers._prefix}email@yopmail.com`,
        jobTitle: `Job${manageUsers._postFix}`,
      }

      cy.get('@btnCancel').should('be.visible').and('not.be.disabled')
      cy.get('@btnSave').should('be.visible').and('be.disabled')
      cy.get('@isFailedPreviously').then((isFailedPreviously) => {
        if (isFailedPreviously) {
          manageUsers.inputProfileInfo(profileInfo)
          // cy.get('@btnCancel').click() //TODO: uncomment this after the issue click on back button it dosen't revert the data into the old one
          // manageUsers.validateProfileInfo(modProfileInfo)
          // cy.get('@btnEditProfile').click()
          // manageUsers.inputProfileInfo(profileInfo)
        } else {
          manageUsers.inputProfileInfo(modProfileInfo)
          // cy.get('@btnCancel').click() //TODO: uncomment this after the issue click on back button it dosen't revert the data into the old one
          // manageUsers.validateProfileInfo(profileInfo)
          // cy.get('@btnEditProfile').click()
          // manageUsers.inputProfileInfo(modProfileInfo)
        }

        manageUsers.clickOnSaveButton(true)

        cy.get('@member').within(($member) => {
          cy.wrap($member).find('td:first').as('columnName')
        })

        if (isFailedPreviously) {
          cy.get('@columnName').should(
            'contain.text',
            `${profileInfo['firstName']} ${profileInfo['lastName']}`
          )
          cy.get('@columnName').should('contain.text', profileInfo['email'])
          manageUsers.validateUserProfileInfo(profileInfo)
        } else {
          cy.get('@columnName').should(
            'contain.text',
            `${modProfileInfo['firstName']} ${modProfileInfo['lastName']}`
          )
          cy.get('@columnName').should('contain.text', modProfileInfo['email'])
          manageUsers.validateUserProfileInfo(profileInfo)
          manageUsers.revertOrgProfileData(profileInfo)
        }
      })
    })
  })
})
