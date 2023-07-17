import Epic from '../../../../classes/Epic'
import CoPManageLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/CopManageLearningPath'
import ItemLearningPath from '../../../../classes/lms-training-cop/my-learning-path/admin/ItemLearningPath'
import ItemLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ItemLearningPathAssertion'
import ListLearningPathAssertion from '../../../../classes/lms-training-cop/my-learning-path/admin/ListLearningPathAssertion'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  const copManageLearningPath = new CoPManageLearningPath()
  const myListPathAssertion = new ListLearningPathAssertion()
  const allListPathAssertion = new ListLearningPathAssertion()
  const itemLearningPath = new ItemLearningPath()
  const itemLearningPathAssertion = new ItemLearningPathAssertion()
  let firstClass
  let tennisCityClub
  const faker = new Faker()

  before(() => {
    copManageLearningPath.stub.copInfo.setAdminLearnTennisUrl(copManageLearningPath)
    copManageLearningPath.stub.existLearningPath.getLearningPathData((data) => {
      faker.setPathFixture(data.firstClassInCityClub)
      firstClass = data.firstClassInCityClub
      tennisCityClub = data.tennisCityClub
    })
  })

  context(Story.manageLearningPaths, () => {
    it('CoP Owner able to see Manage Learning Paths page', () => {
      Story.ticket('QA-1129')
      SignInAs.copOwner()
      const createdByOwner = true
      const notCreatedByOwner = false
      copManageLearningPath.visitManageLearningPath()
      myListPathAssertion.expectMyLearningPathList()

      cy.logInTestCase('Verify see my learning path screen and verify learning item tennis city')
      copManageLearningPath.selectLearningItem(tennisCityClub.name)
      myListPathAssertion.verifyLearningPathItem(tennisCityClub, createdByOwner)
      myListPathAssertion.expectShowCourseItem(tennisCityClub.courses.tennisByYourself, 0)
      myListPathAssertion.expectShowCourseItem(tennisCityClub.courses.scoreInTennis, 1)
      cy.selectItemPerPage()
      myListPathAssertion.expectHasMyLearningTotalCount()
      myListPathAssertion.expectDefaultSortBy()

      cy.logInTestCase('Verify see a learning item created by me in all learning paths')
      copManageLearningPath.selectDropDownAllLearningPaths()
      copManageLearningPath.selectLearningItem(tennisCityClub.name)
      cy.selectItemPerPage(75)
      cy.waitLoadingOverlayNotExist()
      allListPathAssertion.verifyLearningPathItem(tennisCityClub, createdByOwner)
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
      itemLearningPath.clickBack()

      cy.logInTestCase('Verify a learning item not created by me in all learning paths')
      copManageLearningPath.selectDropDownAllLearningPaths()
      copManageLearningPath.selectLearningItem(firstClass.name)
      allListPathAssertion.verifyLearningPathItem(firstClass, notCreatedByOwner)
    })
  })
})
