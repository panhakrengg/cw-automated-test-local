import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInLmsAs = new SignInLmsAs()
  const learning = new Learning()
  let filter

  before(() => {
    new YamlHelper('lms/course-filter/delivery-method-and-all')
      .read()
      .its('FilterAll')
      .then((FilterAll) => {
        filter = FilterAll
      })
    signInLmsAs.ctgMember_Quentin()
  })

  context(Story.courseCatalog, () => {
    it('Learner filter all options then reset', () => {
      Story.ticket('QA-1793')
      learning.visitLearningPage()
      learning.switchToCourseCatalog()

      cy.log('Get Total Courses In Catalog')
      learning.getTotalCoursesInCatalog()

      learning.clickFilterItem('Course Types', filter.courseType)
      learning.clickFilterItem('Languages', filter.languages)
      learning.clickFilterItem('Delivery Methods', filter.deliveryMethod)
      learning.clickFilterItem('Categories/Communities', filter.categoriesCommunities)
      cy.wait(1000)
      learning.expectToShowOnlyFilteredCourses(filter)

      cy.log('Reset Filters')
      learning.resetFilters()

      learning.expectTotalCoursesAreSameAfterRemovingFilters()
    })
  })
})
