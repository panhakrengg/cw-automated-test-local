import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import ItemLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/ItemLearningPath'
import ItemLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ItemLearningPathAssertion'
import ListLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ListLearningPathAssertion'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const myListPathAssertion = new ListLearningPathAssertion()
  const allListPathAssertion = new ListLearningPathAssertion()
  const itemLearningPath = new ItemLearningPath()
  const itemLearningPathAssertion = new ItemLearningPathAssertion()
  let firstClass
  let tennisCityClub

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.existLearningPath.getLearningPathData((data) => {
      firstClass = data.firstClassInCityClub
      tennisCityClub = data.tennisCityClub
    })
  })

  context(Story.manageLearningPaths, () => {
    it('CoP Admin able to see Manage Learning Paths page', () => {
      Story.ticket('QA-1130')
      SignInAs.copAdmin()
      copManageLearningPath.visitManageLearningPath()
      myListPathAssertion.expectMyLearningPathList()

      cy.logInTestCase('Verify see my learning path screen')
      copManageLearningPath.selectLearningItem(firstClass.name)
      myListPathAssertion.verifyLearningPathItem(firstClass, true)
      myListPathAssertion.expectShowCourseItem(firstClass.courses.scoreInTennis, 0)
      myListPathAssertion.expectShowCourseItem(firstClass.courses.practiceMorning, 1)
      myListPathAssertion.expectShowCourseItem(firstClass.courses.onlineTraining, 2)
      cy.selectItemPerPage()
      myListPathAssertion.expectHasMyLearningTotalCount()
      myListPathAssertion.expectDefaultSortBy()

      cy.logInTestCase('Verify see all learning paths')
      copManageLearningPath.selectDropDownAllLearningPaths()
      copManageLearningPath.selectLearningItem(tennisCityClub.name)
      cy.selectItemPerPage(75)
      cy.waitLoadingOverlayNotExist()

      cy.logInTestCase('Verify access learning path item overview and edit behavior')
      allListPathAssertion.verifyLearningPathItem(tennisCityClub, false)
      allListPathAssertion.expectShowCourseItem(tennisCityClub.courses.tennisByYourself, 0)
      allListPathAssertion.expectShowCourseItem(tennisCityClub.courses.scoreInTennis, 1)
      copManageLearningPath.clickThreeDotsOnLearningItem()
      allListPathAssertion.verifyThreeDots()
      copManageLearningPath.clickDelete()
      allListPathAssertion.verifyDeleteLearningPath()
      copManageLearningPath.clickThreeDotsOnLearningItem()
      copManageLearningPath.clickOverview()
      itemLearningPath.init()
      itemLearningPathAssertion.verifySideBar()
      itemLearningPath.clickBack()
      copManageLearningPath.selectDropDownAllLearningPaths()
      copManageLearningPath.clickThreeDotsOnLearningItem()
      copManageLearningPath.clickEdit()
      itemLearningPathAssertion.verifySideBar()
    })
  })
})
