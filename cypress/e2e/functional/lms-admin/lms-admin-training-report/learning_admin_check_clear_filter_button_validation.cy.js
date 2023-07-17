import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'

describe(Epic.LmsAdmin, () => {
  const { yaml, login, actions, assertions } = new TrainingReportsBase()
  let advancedFilterInfo

  before(() => {
    yaml.getClearFilterValidation((data) => (advancedFilterInfo = data))
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learning admin check "Clear Filter" button validation', () => {
      Story.ticket('QA-2158')

      login.toTopLevelAsLearningAdmin()

      cy.logInTestCase('3. Button disabled by default')
      actions.clickNavButtonAdvancedFilters()
      assertions.expectButtonClearFilterDisabled()

      cy.logInTestCase('4. Select course')
      actions.selectCourseDropdownByIndex()
      assertions.expectButtonClearFilterDisabled()

      cy.logInTestCase('5. Tick Show learners who have not booked the selected course')
      actions.tickCheckboxShowLearnersWhoHaveNotBookedCourse()
      assertions.expectButtonClearFilterDisabled()

      cy.logInTestCase('6. Select Category')
      actions.selectCategoryCommunityDropdownByIndex()
      assertions.expectButtonClearFilterEnabled()

      cy.logInTestCase('8. Fill all info')
      actions.reloadTrainingReports()
      actions.clickNavButtonAdvancedFilters()
      actions.fillAdvancedFilter(advancedFilterInfo, true)
      assertions.expectButtonClearFilterEnabled()

      cy.logInTestCase('9. Click clear filter')
      actions.clickButtonClearFilter()
      assertions.verifyAdvancedFilterAfterClear()
    })
  })
})
