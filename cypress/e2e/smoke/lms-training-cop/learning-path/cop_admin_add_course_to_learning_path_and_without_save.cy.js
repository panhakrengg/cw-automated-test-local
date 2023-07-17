import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import ItemLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/ItemLearningPath'
import ListLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ListLearningPathAssertion'
import LearningPathCourses from '../../../../classes/lms/admin/learning-path/LearningPathCourses'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const assertion = new ListLearningPathAssertion()
  const learningPathCourses = new LearningPathCourses()
  const itemLearningPath = new ItemLearningPath()

  let firstClass
  let courseTennisByYourself
  const faker = new Faker()

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.existLearningPath.getLearningPathData((data) => {
      faker.setPathFixture(data.firstClassInCityClub)
      firstClass = data.firstClassInCityClub
      courseTennisByYourself = data.tennisCityClub.courses.tennisByYourself.name
    })
  })

  context(Story.manageLearningPaths, () => {
    it('CoP Admin add course to learning path and go to another without save', () => {
      Story.ticket('QA-1479')
      SignInAs.copAdmin()
      copManageLearningPath.visitManageLearningPath()
      assertion.expectMyLearningPathList()

      cy.logInTestCase('Verify see my learning path screen')
      copManageLearningPath.selectLearningItem(firstClass.name)
      copManageLearningPath.clickThreeDotsOnLearningItem()
      assertion.verifyThreeDots()
      copManageLearningPath.clickAddCourse()

      learningPathCourses.clickAddCourseButton()
      learningPathCourses.searchThenAdd(courseTennisByYourself)
      learningPathCourses.clickAddButton()
      learningPathCourses.expectToSeeCourse(courseTennisByYourself)
      learningPathCourses.expectToSeeSaveCourseButton()

      itemLearningPath.init()
      itemLearningPath.clickBack()
      learningPathCourses.expectToSeeWarningPrompt()

      itemLearningPath.clickBack()
      cy.swal2Confirm(Field.YES).click()
      copManageLearningPath.selectLearningItem(firstClass.name)
      copManageLearningPath.clickThreeDotsOnLearningItem()
      copManageLearningPath.clickAddCourse()
      learningPathCourses.expectNotToSeeCourse(courseTennisByYourself)
    })
  })
})
