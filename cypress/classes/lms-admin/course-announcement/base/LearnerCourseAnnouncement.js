import InstanceOverviewActions from '../../course-instance/learner/actions/InstanceOverviewActions'
import InstanceOverviewAssertions from '../../course-instance/learner/assertions/InstanceOverviewAssertions'

class LearnerCourseAnnouncement {
  constructor() {
    this.assertion = new InstanceOverviewAssertions()
    this.action = new InstanceOverviewActions()
  }
}

export default LearnerCourseAnnouncement
