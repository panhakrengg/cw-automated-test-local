import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import LearningPathOverview from '../../../../classes/lms/admin/learning-path/LearningPathOverview'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const learningPathOverview = new LearningPathOverview()
  let lpNameShortTerm, lpNameChildCourse

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.existLearningPath.getLearningPathData((learningPath) => {
      lpNameShortTerm = learningPath.shortTerm.name
      lpNameChildCourse = learningPath.childCourse.name
    })
    learningPathOverview._setFetchLearningPathDetail()
  })

  const selectOverviewOnLpCard = (lpName) => {
    copManageLearningPath.selectLearningItem(lpName)
    copManageLearningPath.clickThreeDotsOnLearningItem()
    copManageLearningPath.clickOverview()
  }

  context(Story.manageLearningPaths, () => {
    it('CoP Admin check publish/unpublish learning path behavior', () => {
      Story.ticket('QA-1142')

      context('Learning path that no course', () => {
        SignInAs.copAdmin()
        copManageLearningPath.visitManageLearningPath()
        selectOverviewOnLpCard(lpNameShortTerm)

        learningPathOverview.unPublish()
        learningPathOverview.verifyConfirmPublishPopup(false)
        learningPathOverview.verifyConfirmUnpublishPopup()
      })

      context('Learning path that have course', () => {
        copManageLearningPath.visitManageLearningPath()
        copManageLearningPath.filterAllLearningPaths()
        selectOverviewOnLpCard(lpNameChildCourse)

        learningPathOverview.unPublish()
        learningPathOverview.verifyConfirmPublishPopup()
        learningPathOverview.verifyConfirmUnpublishPopup()
      })
    })
  })
})
