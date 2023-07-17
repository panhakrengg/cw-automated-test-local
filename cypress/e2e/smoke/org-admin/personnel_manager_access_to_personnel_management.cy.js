import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import InterceptReq from '../../../classes/base/InterceptReq'
import GlobalMenu from '../../../classes/global-menu/GlobalMenu'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import ManageArea from '../../../classes/personnel-mgt/ManageArea'

describe(Epic.OrgAdmin, { retries: 1, tags: '@skipPrd' }, () => {
  const globalMenu = new GlobalMenu()
  const manageArea = new ManageArea()

  const itcGettingStart = new InterceptReq('/notifications/unread/count', 'notificationUnread')

  const adminPersonnelManagement = () => {
    cy.visitThenSignIn('/', `OrgMgtUsers.personalManagement.admins`)
    manageArea.interceptArea()
    waitGoToMenu('Personnel Management')
    manageArea.wait()
  }

  const waitGoToMenu = (feature) => {
    itcGettingStart.wait()
    globalMenu.getHeaderTitle().click()
    globalMenu.getNav(feature, OrgConst.NAME).click()
  }

  beforeEach(() => {
    itcGettingStart.set()
  })

  context(Story.permissionOrgGlobalMenu, () => {
    it('Personnel Manager access to Personnel Management', () => {
      Story.ticket('QA-42')
      adminPersonnelManagement('admins')
    })
  })
})
