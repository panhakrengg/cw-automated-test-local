import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'

describe(Epic.LmsAdmin, () => {
  const { actions, assertions, constantColumnByRole, login, yaml } = new TrainingReportsBase()
  const defaultColumns = constantColumnByRole.LEARNING_ADMIN

  let columnsAfterAdd2 = defaultColumns
  let add2Columns, remove1Column

  before(() => {
    yaml.getLearningAdminManageColumns((data) => {
      add2Columns = data.add2Columns
      remove1Column = data.remove1Column
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learning admin manage column in report', () => {
      Story.ticket('QA-2159')

      login.toTopLevelAsLearningAdmin()

      cy.logInTestCase('2. Default value')
      actions.select5ItemsPerPage()
      actions.clickIconToCollapseByIndex()
      assertions.expectColumns(defaultColumns)

      cy.logInTestCase('6. Reload page')
      actions.addAndRemoveColumns(add2Columns, remove1Column)
      cy.wait(1000)
      actions.reloadTrainingReports()
      actions.select5ItemsPerPage()
      actions.clickIconToCollapseByIndex()
      assertions.expectColumns(defaultColumns)

      cy.logInTestCase('8. Add 2 more columns')
      columnsAfterAdd2.push(add2Columns[0], add2Columns[1])

      actions.addColumns(add2Columns)
      assertions.expectColumns(columnsAfterAdd2)

      cy.logInTestCase('10. Remove 1 column')
      const columnsAfterRemove1 = columnsAfterAdd2.filter((col) => col !== remove1Column[0])

      actions.removeColumns(remove1Column)
      assertions.expectColumns(columnsAfterRemove1)
    })
  })
})
