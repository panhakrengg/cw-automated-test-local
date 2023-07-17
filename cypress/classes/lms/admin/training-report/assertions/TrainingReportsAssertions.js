import Environment from '../../../../base/Environment'
import TrainingReportsActions from '../actions/TrainingReportsActions'
import TrainingReportsQueries from '../queries/TrainingReportsQueries'

export default class TrainingReportsAssertions extends TrainingReportsQueries {
  #action = new TrainingReportsActions()

  expectButtonClearFilterDisabled() {
    super.getButtonClearFilter().should('be.disabled')
  }
  expectButtonClearFilterEnabled() {
    super.getButtonClearFilter().should('be.enabled')
  }

  #expectAllFiltersClearedExpectCourse() {
    cy.shouldExist(super.getDropdownToggleCourses(), '.custom-badge')

    cy.shouldNotHaveValue(super.getInputLearnerName())
    cy.shouldNotHaveValue(super.getInputStartDate())
    cy.shouldNotHaveValue(super.getInputEndDate())
    cy.shouldNotHaveValue(super.getInputLocation())
    cy.shouldNotExist(super.getDropdownToggleCategoryCommunity(), '.custom-badge')
    cy.shouldNotExist(super.getDropdownToggleDeliveryMethods(), '.custom-badge')
    cy.shouldNotExist(super.getDropdownToggleCourseStatus(), '.custom-badge')
  }

  #expectInstanceTitleCell(title) {
    cy.expectElementWithLabelVisible(title, '[tabulator-field="instanceTitle"]')
  }
  #expectNamePublicProfileCell(name) {
    cy.expectElementWithLabelVisible(name, '[tabulator-field="learnerName"]')
  }
  #expectNameOrgProfileCell(name) {
    cy.expectElementWithLabelVisible(name, '[tabulator-field="orgProfileInfo.orgProfileFullName"]')
  }
  #expectEmailOrgProfileCell(name) {
    cy.expectElementWithLabelVisible(name, '[tabulator-field="orgProfileInfo.orgProfileEmail"]')
  }
  #expectAccountEmailCell(email) {
    cy.expectElementWithLabelVisible(email, '[tabulator-field="email"]')
  }
  #expectCourseTitleCell(title) {
    cy.expectElementWithLabelVisible(title, '[tabulator-field="courseTitle"]')
  }

  verifyAdvancedFilterAfterClear() {
    this.#expectAllFiltersClearedExpectCourse()
    this.expectButtonClearFilterDisabled()
    cy.shouldExist(super.getCheckboxIncludeLearnersNotOrgMember())
  }

  expectColumnHeaders(columns) {
    const reorderColumns = super.reorderColumns(columns)

    super.getTotalColumnHeader().then((totalHeader) => {
      super.getTabulatorHeaders().within(() => {
        for (let index = 0; index < totalHeader; index++) {
          cy.shouldVisible(super.getColumnHeaderWithTitle(reorderColumns[index]))
        }
      })
    })
  }

  #expectColumnCollapse(columns, rowIndex) {
    const reorderColumns = super.reorderColumns(columns)

    super.getTotalColumnHeader().then((totalHeader) => {
      const startColIndex = totalHeader

      super.getTabulatorRowByIndex(rowIndex).within(() => {
        for (let index = startColIndex; index < reorderColumns.length; index++) {
          cy.shouldVisible(super.getColumnCollapseWithTitle(reorderColumns[index]))
        }
      })
    })
  }

  expectColumns(columns, recordIndex) {
    this.expectColumnHeaders(columns)
    this.#expectColumnCollapse(columns, recordIndex)
  }

  expectSearchResultLabel(keyword) {
    super.getSearchResultText().then((searchResultText) => {
      expect(searchResultText).contains(`Search results for ‘${keyword}’: `)
    })
  }

  expectRecordEqualToSearchResult() {
    super.getTotalRecord().then((totalRecord) => {
      super.getSearchResultText().then((searchResultText) => {
        expect(searchResultText).contains(`: ${totalRecord}`)
      })
    })
  }

  expectTotalRecordAtLeast(expectTotalRecord) {
    super.getTabulatorRow().should('have.length.at.least', expectTotalRecord)
  }

  expectRecordWithInstanceInfo(instance) {
    const { title, managePeople } = instance

    cy.logInTestCase(`Report of '${title}'`)
    super
      .getTabulatorRowByLabel(title)
      .should('have.length.at.least', managePeople.learners.length)
      .each(($row) => {
        cy.wrap($row).within(() => {
          super.getTabulatorCell().each(($cell) => cy.shouldNotEmpty(cy.wrap($cell)))
          this.#expectInstanceTitleCell(title)
        })
      })
  }

  expectNoRecord() {
    super.getTabulatorRow().should('have.length', '0')
  }

  expectRecordWithLearnerAndCourseInfo(learner, course) {
    const { fullName, email } = learner

    super
      .getTabulatorRowByLabel(course.name)
      .should('have.length.at.least', course.totalRecordAtLeast)
      .each(($row) => {
        cy.wrap($row).within(() => {
          this.#expectNameOrgProfileCell(fullName)
          this.#expectNamePublicProfileCell(fullName)
          this.#expectAccountEmailCell(email)
        })
      })
  }
  expectRecordWithCourseInfo(courseName) {
    super.getTabulatorRowByLabel(courseName).each(($row) => {
      cy.wrap($row).within(() => {
        this.#expectCourseTitleCell(courseName)
      })
    })
  }

  expectNotSeeRecord(value) {
    value.forEach((eachValue) => {
      super.getTabulatorRowByLabel(eachValue).should('have.length', '0')
    })
  }

  expectRecordWithLearnerAndInstanceInfo(learner, instance, courseName) {
    const { fullName, email, screenName } = learner
    const { title, courseStatus } = instance

    super.getTabulatorRowByLabel(title).each(($row) => {
      cy.wrap($row).within(() => {
        this.#action.clickIconToCollapse()
        super.getTabulatorCell().each(($cell) => cy.shouldNotEmpty(cy.wrap($cell)))

        this.#expectNamePublicProfileCell(fullName)
        this.#expectAccountEmailCell(email)
        this.#expectInstanceTitleCell(title)
        if (courseName) this.#expectCourseTitleCell(courseName)
        if (courseStatus) this.#expectCourseStatus(courseStatus, screenName)
      })
    })
  }

  expectCannotSeeColumnHeaders(columns) {
    super.getTabulatorHeaders().within(() => {
      columns.forEach((col) => cy.shouldNotVisible(super.getColumnHeaderWithTitle(col)))
    })
  }

  expectRecordWithLearnerInfo(learner) {
    const { fullName, email } = learner

    super.getTabulatorRowByLabel(email).each(($row) => {
      cy.wrap($row).within(() => {
        super.getTabulatorCell().each(($cell) => cy.shouldNotEmpty(cy.wrap($cell)))
        this.#expectNamePublicProfileCell(fullName)
        this.#expectAccountEmailCell(email)
      })
    })
  }

  #expectCourseStatus(courseStatus, screenName) {
    if (courseStatus[screenName]) {
      const { status, completedDate, percentage } = courseStatus[screenName]

      cy.expectElementWithLabelVisible(status)
      if (percentage) cy.expectElementWithLabelVisible(percentage)
      if (completedDate)
        cy.expectElementWithLabelVisible(completedDate[new Environment().getEnvPrefix()])
    }
  }

  verifyAfterUserUpdateProfile(originalProfile, updateProfile, instance) {
    const screeName = originalProfile.screenName
    const { title, deliveryMethod, courseStatus } = instance
    const { status, completedDate } = courseStatus[screeName]

    cy.logInTestCase(`Report of '${title}'`)
    super
      .getTabulatorRowByLabel(title)
      .first()
      .within(() => {
        this.#action.clickIconToCollapse()

        this.#expectNameOrgProfileCell(originalProfile.fullName)
        this.#expectNamePublicProfileCell(updateProfile.fullName)
        this.#expectAccountEmailCell(originalProfile.email)
        cy.expectElementWithLabelVisible(title)
        cy.expectElementWithLabelVisible(deliveryMethod)
        cy.expectElementWithLabelVisible(status)
        if (completedDate)
          cy.expectElementWithLabelVisible(completedDate[new Environment().getEnvPrefix()])
      })
  }

  verifyAfterUserChangeEmail(learner, instance) {
    const { email, secondEmail, screeName } = learner
    const { title, deliveryMethod, courseStatus } = instance

    super
      .getTabulatorRowByLabel(title)
      .first()
      .within(() => {
        this.#action.clickIconToCollapse()

        this.#expectAccountEmailCell(secondEmail) // new email
        this.#expectEmailOrgProfileCell(email) // previous email
        cy.expectElementWithLabelVisible(title)
        cy.expectElementWithLabelVisible(deliveryMethod)
        this.#expectCourseStatus(courseStatus, screeName)
      })
  }
}
