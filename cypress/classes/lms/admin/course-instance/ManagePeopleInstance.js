import InterceptReq from '../../../base/InterceptReq'
import { CourseInstancesNav } from '../../base-manage-course/LmsAdminConstant'
import ManageCourses from '../../ManageCourses'
import BaseCourseInstance from './base-course-instance/BaseCourseInstance'
import Field from '../../../constants/Field'

class ManagePeopleInstance extends BaseCourseInstance {
  _itcFetchUsersInstance = new InterceptReq('/course_instance/fetch_users', 'FetchUsersInstance')
  #itcRemoveMember = new InterceptReq('/manage_people/remove', 'removeMember')

  removeMember(memberEmail) {
    cy.waitLoadingOverlayNotExist()
    cy.get('.table-wrapper')
      .eq(1)
      .as('memberTable')
      .invoke('text')
      .then(($text) => {
        if ($text.includes(memberEmail)) {
          cy.get('@memberTable')
            .find(`tr:contains('${memberEmail}')`)
            .within(($row) => cy.wrap($row).clickDropdownItem(Field.REMOVE))
          this.#itcRemoveMember.set()
          cy.swal2Confirm(Field.YES_REMOVE).click()
          this.#itcRemoveMember.wait()
        }
      })
  }

  visitThenRemoveInstanceMember(memberData) {
    cy.logInTestCase('Remove a instance member')
    new ManageCourses().accessCourseInstanceBy(
      this.courseId,
      this.instanceId,
      CourseInstancesNav.PEOPLE
    )
    this.removeMember(memberData)
  }
}
export default ManagePeopleInstance
