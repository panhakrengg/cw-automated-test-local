import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageUser from '../../../../classes/org-management/ManageUser'
import Field from '../../../../classes/constants/Field'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  context(Story.manageUsers, () => {
    it('Org Admin able to see members table when read mode is not on', () => {
      Story.ticket('QA-473')
      manageUser.signInAsOrgAdmin()
      manageUser.expectedInviteButtonIsVisible()
      manageUser.expectedMemberThreeDotsOptionIsVisibled('au2faroot', 'Remove from organization')
      manageUser.clearMemberSearchBox()
      manageUser.expectedMemberThreeDotsOptionIsVisibled('inviteuser01@yopmail.com', Field.REMOVE)
    })
  })
})
