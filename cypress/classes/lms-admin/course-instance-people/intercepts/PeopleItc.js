import InterceptReq from '../../../base/InterceptReq'

class PeopleItc {
  static getMembersCourse = new InterceptReq('/course/get_members', 'GetMembersCourse')
  static getAdminMembersCourse = new InterceptReq(
    '/course/get_admin_members',
    'GetAdminMembersCourse'
  )
  static searchUsersManagePeople = new InterceptReq(
    '/manage_people/users/search',
    'SearchUsersManagePeople'
  )
}
export default PeopleItc
