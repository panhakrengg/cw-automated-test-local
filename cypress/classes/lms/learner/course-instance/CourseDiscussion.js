import InterceptAction from '../../../base/InterceptAction'
import Discussion from '../../../constants/Discussion'
import Learning from '../../Learning'
import CourseInstanceDetail from './CourseInstanceDetail'

class CourseDiscussion {
  #course

  setCourse(course) {
    this.#course = course
  }

  #itcAddVisitedDiscussionActivity = new InterceptAction(
    '/add/visited-discussion/activity',
    'AddVisitedDiscussionActivity'
  )

  _entryPoint() {
    const learning = new Learning()
    const courseInstanceDetail = new CourseInstanceDetail()
    learning.visitLearningPage()
    learning.openViewMyCourseBy(this.#course.name)
    learning.clickInstanceInMyCoursePopup(this.#course.discussion.date)
    this.#itcAddVisitedDiscussionActivity.set()
    courseInstanceDetail._clickOnTab(Discussion.DISCUSSIONS)
    this.#itcAddVisitedDiscussionActivity.wait()
  }

  entryPointAccessViaUrl(instanceId) {
    this.#itcAddVisitedDiscussionActivity.set()
    cy.visit(
      `/web/ci${instanceId}/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_isMyLearning=true&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail#_courseDetailPortlet_tab=discussions`
    )
    this.#itcAddVisitedDiscussionActivity.wait()
  }
}

export default CourseDiscussion
