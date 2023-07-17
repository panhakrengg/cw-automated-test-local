import Epic from '../../../../classes/Epic'
import LearningPathMembers from '../../../../classes/lms/admin/learning-path/LearningPathMembers'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInAsLms = new SignInLmsAs()
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const learningPathDetail = new LearningPathDetail()
  const learningPathMembers = new LearningPathMembers()
  const faker = new Faker()

  context(Story.learningPaths, () => {
    let learningPath
    let learningPathTitle
    let orgFullCatalogId
    let learningPathId
    let user

    before(() => {
      new YamlHelper('lms/learning-path/sample-learning-path')
        .read()
        .then(({ LearningPathData }) => {
          learningPath = LearningPathData.savingNoBook
          learningPathTitle = learningPath.name
          learningPathDetail.setLearningPath(learningPath)
          faker.setPathFixture(learningPath)
          learningPathId = faker.getUrlId()
        })
      new YamlHelper('org-structure/org-info').read().then(({ FireCloudZone }) => {
        faker.setPathFixture(FireCloudZone.lms.orgFullCatalog)
        orgFullCatalogId = faker.getUrlId()
      })
      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat.auLnCtgMem_Quentin')
        .then((data) => {
          user = data
        })
    })
    it('Category Member save learning path that not contain booked course', () => {
      Story.ticket('QA-1504', ['CW-9064'])
      context('Go to learning path detail', () => {
        signInAsLms.ctgMember_Quentin()
        learning.visitLearningPage()
        learning.searchCourse(`"${learningPathTitle}"`)
      })

      context('Leave/Save learning path', () => {
        learningPathDetail.clickLearningPathBy(learningPathTitle)
        learningPathDetail.clickButtonLeaveLearningPath()
        cy.wait(1000)
        learningPathDetail.clickButtonSaveThisToMyLearningPath()
      })

      cy.logInTestCase('Verify no booked course')
      learningPathDetail.expectToSeeLearningPathEmptyProgressSection()
      learningPathDetail.expectTotalUnBookCourse(2)
      courseDetail.clickBackIcon()
      learning.expectToSeeEmptyProgressSectionBy(learningPathTitle, 2)

      cy.logInTestCase('Admin could see member in the list')
      signInAsLms.lnPathAdmin_Emery()
      learningPathMembers._visitOrgLmsLearningPath(orgFullCatalogId, learningPathId)
      cy.cecTable()
      learningPathMembers._clickOnDateLabelToSortMember()
      learningPathMembers._expectToSeeLearningPathMemberInfo(user, user.fullName, 'Not yet started')

      context('Remove member from the list', () => {
        learningPathMembers._removeLearningPathMember()
      })
    })
  })
})
