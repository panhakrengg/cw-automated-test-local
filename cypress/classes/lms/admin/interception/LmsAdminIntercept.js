import InterceptReq from '../../../base/InterceptReq'

class LmsAdminIntercept {
  static _itcCourseInstanceOptions = new InterceptReq(
    '/manage_courses/course_instance/options',
    'CourseInstanceOptions'
  )
  static _itcGetAdminMembers = new InterceptReq('/course/get_admin_members', 'GetAdminMembers')
  static _itcGetMembers = new InterceptReq('/course/get_members', 'GetMembers')
  static _itcAddManageMember = new InterceptReq('/manage_member/add', 'AddManageMember')
  static _itcSearchUsersManagePeople = new InterceptReq(
    '/manage_people/users/search',
    'SearchUsersManagePeople'
  )
  static _itcRemoveMemberRole = new InterceptReq('/manage_people/remove', 'RemoveMemberRole')
  static _itcUpdateMemberStatus = new InterceptReq(
    '/course_instance/member_status/update',
    'UpdateMemberStatus'
  )
}
export default LmsAdminIntercept
