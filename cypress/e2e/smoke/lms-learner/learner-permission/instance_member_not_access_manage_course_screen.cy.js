import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import GlobalMenu from '../../../../classes/global-menu/GlobalMenu'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  context(Story.learnerPermission, () => {
    it('Instance Member not able to access the manage course screen', () => {
      Story.ticket('QA-1159', ['CW-16516'])
      new SignInLmsAs().istMember_Mallory()
      new GlobalMenu().expectLearningAdminMenuNotExistInGlobalNavigation()
      new ManageCourses().getManageCourseUrl().then((url) => {
        cy.visit(url, { failOnStatusCode: false })
      })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
