import Epic from '../../../../classes/Epic'
import ManageMemberProfile from '../../../../classes/org-management/ManageMemberProfile'
import ManageUser from '../../../../classes/org-management/ManageUser'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  const manageMemberProfile = new ManageMemberProfile()
  let email

  before(() => {
    cy.readFile('cypress/fixtures/validation/email.yaml').then((emailString) => {
      email = YAML.parse(emailString)
    })
  })

  context(Story.manageUsers, () => {
    it('Org Admin invite a user via email show error message validate form', () => {
      manageUser.signInAsOrgAdmin()
      manageMemberProfile.inviteViaEmail()
      manageMemberProfile.inputEmail([email.Emails.invalid])
      manageMemberProfile.lostFocusEmailElement()
      manageMemberProfile.expectToHaveErrorMessage('Please enter a valid email address.')
      manageMemberProfile.expectNextButtonShouldBeDisabled()
    })
  })
})
