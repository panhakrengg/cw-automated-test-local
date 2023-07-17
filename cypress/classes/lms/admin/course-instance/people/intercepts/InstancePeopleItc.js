import InterceptReq from '../../../../../base/InterceptReq'

export default class InstancePeopleItc {
  static removeMember = new InterceptReq('/manage_people/remove', 'removeMember')
  static searchUsersManagePeople = new InterceptReq(
    '/manage_people/users/search',
    'SearchUsersManagePeople'
  )
  static addManageMember = new InterceptReq('/manage_member/add', 'AddManageMember')
  static getMembersCourse = new InterceptReq('/course/get_members', 'GetMembersCourse')
}
