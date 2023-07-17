import { OrgConst } from '../../org-management/base-org-management/OrgStub'

class WebNotificationConstant {
  static ORGANIZATION_NAME = OrgConst.NAME
  static INVITE_TO_JOIN_ORGANIZATION = `would like to add you into ${this.ORGANIZATION_NAME} organization.`
  static REQUEST_TO_ACCESS = 'requested to access'
}

export default WebNotificationConstant
