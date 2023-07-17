import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  const learningCoP = new LearningCoP(CoPConst.URL)
  const learningPathDetail = new LearningPathDetail()
  const learning = new Learning()
  const lmsTrainingCop = new LmsTrainingCopBase()
  context(Story.learner, () => {
    let learningPathName
    let courseName

    before(() => {
      lmsTrainingCop.stub.existLearningPath.getFirstClassInCityClub((learningPath) => {
        learningPathName = learningPath.name
      })
      lmsTrainingCop.stub.publishUnpublishCourse.getScoreInTennis((course) => {
        courseName = course.name
      })
    })

    it('Learner click view course from learning path', () => {
      Story.ticket('QA-949')

      SignInAs.copMember()
      context('Redirect to my learning', () => {
        learningCoP.visitLearning()
        cy.waitLoadingOverlayNotExist()
      })

      context('View Course in learning path', () => {
        learningCoP._filterByLabelName('Learning Path')
        learningPathDetail._clickLearningPathByTitle(learningPathName)
        cy.getElementWithLabel(courseName, 'a').click()
        learning.expectToSeeBookingOption()
        learningPathDetail._clickOnLpNameBreadcrumb()
        learningPathDetail._expectBackToLearningPath(learningPathName)
      })
    })
  })
})
