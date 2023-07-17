import Epic from '../../../../classes/Epic'
import CourseDetailOverview from '../../../../classes/lms/CourseDetailOverview'
import Learning from '../../../../classes/lms/Learning'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.LmsLearner, { retries: 2 }, () => {
  const learning = new Learning()
  const courseDetailOverview = new CourseDetailOverview()
  const tagsAndSkillsName = 'Compliance & Leadership'

  before(() => {
    SignInAs.member_Arielle()
    courseDetailOverview._setCourse({ tagSkill: tagsAndSkillsName })
  })

  context(Story.courseCatalog, () => {
    it('Learner filter by Tags and skills', () => {
      Story.ticket('QA-1798')
      learning.visitLearningPage()
      learning.switchToCourseCatalog()
      learning.clickFilterItem('Tags and Skills', tagsAndSkillsName)

      learning.clickOnCourseInPosition('first-child')
      courseDetailOverview._verifyCourseTagsAndSkills(true, true)
      cy.go('back')
      cy.waitLoadingOverlayNotExist()
      learning.clickOnCourseInPosition('last-child')
      courseDetailOverview._verifyCourseTagsAndSkills(true, true)
    })
  })
})
