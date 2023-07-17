import PublishUnPublishCourse from '../../../lms/PublishUnPublishCourse'
import AdminCourseListActions from '../../../lms/admin/course-list/actions/AdminCourseListActions'
import AdminCourseListLogin from '../../../lms/admin/course-list/base/mock/AdminCourseListLogin'
import CommunitySharingActions from '../../../lms/admin/course/actions/CommunitySharingActions'
import ModifyCourseActions from '../../../lms/admin/course/actions/ModifyCourseActions'
import CommunitySharingLogin from '../../../lms/admin/course/base/mock/CommunitySharingLogin'
import CourseOverviewLogin from '../../../lms/admin/course/base/mock/CourseOverviewLogin'
import ModifyCourseLogin from '../../../lms/admin/course/base/mock/ModifyCourseLogin'
import ResourceActions from '../../../lms/base/actions/ResourceActions'
import ResourceLogin from '../../../lms/base/mock/ResourceLogin'
import ManageCourseConsent from '../../../org-management/org-admin/ManageCourseConsent'
import LogCourseYaml from '../mock/LogCourseYaml'
import ChangeLogBase from './ChangeLogBase'
import ChangeLogCourseAssertions from './assertions/ChangeLogCourseAssertions'

export default class ChangeLogCourseBase extends ChangeLogBase {
  constructor() {
    super()
    this.actionCourseList = new AdminCourseListActions()
    this.actionModifyCourse = new ModifyCourseActions()
    this.actionPublish = new PublishUnPublishCourse()
    this.loginCourseList = new AdminCourseListLogin()
    this.loginCourseOverview = new CourseOverviewLogin()
    this.loginModifyCourse = new ModifyCourseLogin()
    this.yaml = new LogCourseYaml()
    this.assertion = new ChangeLogCourseAssertions()
  }
}

export class ChangeLogFacilitatorResourceBase extends ChangeLogBase {
  constructor() {
    super()
    this.yaml = new LogCourseYaml()
    this.loginResource = new ResourceLogin()
    this.actionResource = new ResourceActions()
    this.assertion = new ChangeLogCourseAssertions()
  }
}

export class ChangeLogCourseConsentBase extends ChangeLogCourseBase {
  constructor() {
    super()
    this.actionManageConsent = new ManageCourseConsent()
  }
}

export class ChangeLogCommunityShareBase extends ChangeLogBase {
  constructor() {
    super()
    this.actionCommunitySharing = new CommunitySharingActions()
    this.actionCourseList = new AdminCourseListActions()
    this.loginCommunitySharing = new CommunitySharingLogin()
    this.loginCourseList = new AdminCourseListLogin()
    this.yaml = new LogCourseYaml()
    this.assertion = new ChangeLogCourseAssertions()
  }
}
