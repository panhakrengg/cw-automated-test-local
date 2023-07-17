import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import LearningPathMembers from '../../../../classes/lms/admin/learning-path/LearningPathMembers'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsTrainingCop, () => {
  const faker = new Faker()
  const learning = new Learning()

  let lpMissionEveningDetail
  let lpMissionEvening
  let copMember
  const lmsTrainingCop = new LmsTrainingCopBase()
  before(() => {
    lmsTrainingCop.stub.existLearningPath.getMissionEvening((learningPath) => {
      lpMissionEvening = learningPath
      faker.setPathFixture(lpMissionEvening)
      lpMissionEveningDetail = new LearningPathDetail(lpMissionEvening)
    })
    cy.stubUser(UserRole.CoPUsers.MEMBER)
    cy.get('@stubUser').then((user) => {
      copMember = user
    })
    SignInAs.copMember()
  })

  context(Story.learner, () => {
    it('Learner save learning path that contain completed course', () => {
      Story.ticket('QA-948')

      cy.logInTestCase('Redirect to cop learning')
      lpMissionEveningDetail.visitLearningPathDetail(faker.getUrlId())

      cy.logInTestCase('Save Learning path and display overview screen')
      lpMissionEveningDetail._getLeaveLearningPathButtonLabel().then(($text) => {
        if ($text.trim() === lpMissionEveningDetail.leaveLearningPathButtonLabel) {
          lpMissionEveningDetail._leaveLearningPath()
        } else {
          lpMissionEveningDetail._saveLearningPath()
          lpMissionEveningDetail._expectToSeeLearningPathOverview()
        }
      })

      cy.logInTestCase('Redirect to my learning and Search Learning Path by name')
      learning.visitLearningPage()
      learning.showItemPerPage(75)
      learning.getCourseByName(lpMissionEvening.name).within(() => {
        lpMissionEveningDetail._expectToSeeLearningPathBaseProgressSection()
      })

      cy.logInTestCase('Visit As Learning Admin')
      SignInAs.reSignInAsCopAdmin()
      const learningPathMembers = new LearningPathMembers()
      learningPathMembers.visitMembers(faker.getUrlId())
      learningPathMembers._clickOnDateLabelToSortMember()
      learningPathMembers._expectToSortLearningPathMemberDescending()
      learningPathMembers._expectToSeeLearningPathMemberInfo(copMember, copMember.screenName)
      learningPathMembers._removeLearningPathMember()
    })
  })
})
