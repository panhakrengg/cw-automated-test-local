import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Environment from '../../../../../classes/base/Environment'
import Field from '../../../../../classes/constants/Field'
import ManageUser from '../../../../../classes/org-management/ManageUser'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  const env = new Environment()
  const yamlHelper = new YamlHelper('users-orgmgt')
  let screenName
  let orgInfo

  before(() => {
    cy.readFile('cypress/fixtures/org-structure/org-info.yaml').then((orgInfoString) => {
      orgInfo = YAML.parse(orgInfoString)
    })
    yamlHelper
      .read()
      .its(UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
      .then((userInfo) => {
        screenName = userInfo.users[env.getEnvYaml()].screenNames[0]
      })
  })
  beforeEach(() => {
    manageUser.setItc()
    manageUser.signInAsOrgAdmin()
    manageUser.waitItc()
    manageUser.searchMemberByName(screenName)
  })
  context(Story.manageUsersMemberSecurity, () => {
    it('Click on View Organization Profile and verify popup', () => {
      manageUser.showMemberTableFirstRowOnAction('View Organization Profile')
      cy.get('.swal2-container').within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup)
          .get('div.d-flex.text-black > .font-weight-bold')
          .should('contain.text', 'Organization Details')
        cy.wrap($popup).get('.information-banner').should('be.visible')
        cy.wrap($popup)
          .get('.d-flex.my-3 > .text-black')
          .should('contain.text', 'Public Profile Details')
        cy.wrap($popup)
          .get(':nth-child(5) > div.align-items-center > .font-weight-bold')
          .should('contain.text', 'Activities')
        cy.wrap($popup).get('.swal2-header > button').click()
      })
    })

    it('Click on Force password reset and verify popup', () => {
      manageUser.showMemberTableFirstRowOnAction('Force password reset')
      cy.get('@tableMember').verifySwal2Confirmation(
        'Would you like to force this member to reset password?',
        'This user will need to set a new password the next time he/she logs in.',
        Field.YES_FORCE,
        Field.CANCEL
      )
    })

    it('Click on Manage 2-Step Verification (2SV) and verify popup', () => {
      manageUser.showMemberTableFirstRowOnAction('Manage 2-Step Verification (2SV)')
      cy.get('.swal2-container').within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup).get('.swal2-header > button').click()
      })
    })

    it('Click on Lock account and verify popup', () => {
      manageUser.showMemberTableFirstRowOnAction('Lock account')
      cy.get('@tableMember').verifySwal2Confirmation(
        'Would you like to lock this account?',
        'This user will not be able to log in anymore and will be notified that his/her account is locked.',
        Field.YES_LOCK,
        Field.CANCEL
      )
    })

    it('Click on Remove from organization and verify popup', () => {
      manageUser.showMemberTableFirstRowOnAction('Remove from organization')
      cy.get('@tableMember').verifySwal2Confirmation(
        'Would you like to remove this member from your organization?',
        'This user will lose access to the subscription benefits they had when they were in the organization.',
        Field.YES_REMOVE,
        Field.CANCEL
      )
    })
  })
})
