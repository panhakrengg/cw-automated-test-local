import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import CreateLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CreateLearningPath'
import LearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/LearningPathAssertion'
import ListLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ListLearningPathAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const learningPathAssertion = new LearningPathAssertion()
  const createLearningPath = new CreateLearningPath()
  const listLearningPathAssertion = new ListLearningPathAssertion()
  let quickTip

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.createLearningPath.getQuickTip((data) => {
      quickTip = data
    })
  })

  context(Story.manageLearningPaths, () => {
    it('CoP Owner able to see create new learning path screen', () => {
      Story.ticket('QA-941')

      SignInAs.copOwner()
      copManageLearningPath.visitManageLearningPath()
      copManageLearningPath.clickCreateNewButton()
      createLearningPath.init()
      learningPathAssertion.expectSaveButtonDisable()
      learningPathAssertion.expectShowCourseImageBanner()
      learningPathAssertion.expectShowEditor()
      learningPathAssertion.expectShowDuration()
      learningPathAssertion.expectLearningPathCompletion()

      learningPathAssertion.expectSaveEnableAfterTypeTitle()
      learningPathAssertion.expectShowQuickTip(quickTip)
      createLearningPath.clickBack()
      listLearningPathAssertion.expectMyLearningPathList()
    })
  })
})
