import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import LearningPathCourses from '../../../../classes/lms/admin/learning-path/LearningPathCourses'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const learningPathCourses = new LearningPathCourses()
  let lpName, publishCourseFromTrainingCoP1, publishCourseFromTrainingCoP2
  let publishCourseFromOrg, unpublishCourseFromTrainingCoP

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.existLearningPath.getLearningPathData((learningPath) => {
      lpName = learningPath.shortTerm.name
    })
    copManageLearningPath.stub.existLearningPath.getCourseData((course) => {
      publishCourseFromTrainingCoP1 = course.tennisByYourself.name
      publishCourseFromTrainingCoP2 = course.tennisWarmUpGuide.name
      publishCourseFromOrg = course.basicHtml.name
      unpublishCourseFromTrainingCoP = course.acceptedForEveryone.name
    })
  })

  context(Story.manageLearningPaths, () => {
    it('CoP Admin able to see only publish courses under training cop in "Add Course to Learning Path" popup', () => {
      Story.ticket('QA-1143')

      SignInAs.copAdmin()
      copManageLearningPath.visitManageLearningPath()
      copManageLearningPath.selectLearningItem(lpName)
      copManageLearningPath.clickThreeDotsOnLearningItem()
      copManageLearningPath.clickAddCourse()

      learningPathCourses.clickAddCourseButton()
      learningPathCourses.searchThenExpectToSeeCourse(publishCourseFromTrainingCoP1)
      learningPathCourses.searchThenExpectToSeeCourse(publishCourseFromTrainingCoP2)
      learningPathCourses.searchThenExpectCannotSeeCourse(unpublishCourseFromTrainingCoP)
      learningPathCourses.searchThenExpectCannotSeeCourse(publishCourseFromOrg)
    })
  })
})
