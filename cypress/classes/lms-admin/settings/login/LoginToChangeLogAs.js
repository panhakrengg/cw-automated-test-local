import SignInAs from '../../../utilities/SignInAs'
import ChangeLogItc from '../change-log/intercepts/ChangeLogItc'
import ChangeLogQueries from '../change-log/queries/ChangeLogQueries'

export default class LoginToChangeLogAs extends ChangeLogQueries {
  learningAdminEmery() {
    ChangeLogItc.itcGetManageStorageOverview.set()
    SignInAs.learningAdminEmery(super.getLearningAdminSettingUrl())
    ChangeLogItc.itcGetManageStorageOverview.wait()
    cy.waitLoadingOverlayNotExist()
  }

  orgAdminAmy() {
    ChangeLogItc.itcGetManageStorageOverview.set()
    SignInAs.orgAdmin_Amy(super.getLearningAdminSettingUrl())
    ChangeLogItc.itcGetManageStorageOverview.wait()
    cy.waitLoadingOverlayNotExist()
  }
}
