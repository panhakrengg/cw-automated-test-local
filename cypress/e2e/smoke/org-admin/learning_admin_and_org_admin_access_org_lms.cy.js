import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import InterceptReq from '../../../classes/base/InterceptReq'
import GlobalMenu from '../../../classes/global-menu/GlobalMenu'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import UserRole from '../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  const globalMenu = new GlobalMenu()
  const itcGettingStart = new InterceptReq('/notifications/unread/count', 'notificationUnread')
  const waitGoToMenu = (feature) => {
    itcGettingStart.wait()
    globalMenu.getHeaderTitle().click()
    globalMenu.getNav(feature, OrgConst.NAME).click()
  }
  const orgMgtAdminAccessFeature = (feature, role) => {
    cy.visitThenSignIn('/', role)
    waitGoToMenu(feature)
  }

  beforeEach(() => {
    itcGettingStart.set()
  })

  context(Story.permissionOrgGlobalMenu, () => {
    it('Learning Admin access Org LMS', () => {
      Story.ticket('QA-41')
      orgMgtAdminAccessFeature('Learning Admin', UserRole.ORG_ADMIN.LEARNING)
    })
    it('Organization Admin access Org LMS', () => {
      Story.ticket('QA-40')
      orgMgtAdminAccessFeature('Organization Management', UserRole.ORG_ADMIN.ORGANIZATION)
    })
  })
})
