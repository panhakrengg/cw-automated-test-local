import Field from '../../../../constants/Field'
import UserAccountUtil from '../../../../utilities/UserAccountUtil'
import ChangeLogActions from '../actions/ChangeLogActions'
import { LogLabel } from '../constant/ChangeLogConstant'
import ChangeLogQueries from '../queries/ChangeLogQueries'
export default class ChangeLogAssertions extends ChangeLogQueries {
  changeLogAction = new ChangeLogActions()

  expectToSeeChangeLogList() {
    super.getListChangeLogWrapper().should('be.visible')
  }

  expectTheFirstRowContainText(changeLog) {
    super.getFirstChangeLog().within(() => {
      cy.expectElementWithLabelVisible(changeLog, 'span')
    })
  }

  expectTheFirstRowNotContainText(changeLog) {
    super.getFirstChangeLog().within(() => {
      cy.expectElementWithLabelNotExist(changeLog)
    })
  }

  expectToSeeLogDateTime() {
    const time = new UserAccountUtil().getDateByDefaultTimeZone()
    cy.expectElementWithLabelVisible(`${time.format('ll h')}:`, 'div')
  }

  verifyFirstChangeLog(changeLog, activity, callback = () => {}) {
    super.getFirstChangeLogByTitle(changeLog).within(() => {
      this.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      this.expectADetailLogBold(LogLabel.ACTIVITY, activity.title)
      cy.expectElementWithLabelVisible('(File)', 'i')
      callback() //For expand details
    })
  }

  expectToSeeDetailForActivity(activity) {
    const { title, uploadFiles, description, templateOption, coverImage } = activity
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.getCollapseChangeLog().within(() => {
      if (title) {
        this.expectADetailLogStrong(LogLabel.TITLE, title)
      }
      if (uploadFiles) {
        this.expectADetailLogStrong(LogLabel.FILE, uploadFiles.name[0])
      }
      if (description) {
        this.expectADetailLogStrong(LogLabel.DESCRIPTION, description)
      }
      if (templateOption) {
        this.expectADetailLogStrong(LogLabel.TEMPLATE_OPTION, templateOption)
      }
      if (coverImage) {
        const { path } = coverImage
        this.expectADetailLogStrong(LogLabel.INCLUDE_COVER_IMAGE, path ? path : Field.DISABLED)
      }
    })
  }

  expectToSeeDetailForEditActivity(oldActivity, newActivity) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.getCollapseChangeLog().within(() => {
      if (newActivity.title) {
        super.getTabPanelItemRowByLabel('Title:').within(($item) => {
          cy.expectElementWithLabelVisible(oldActivity.title)
          cy.hasSvgIcon()
          cy.expectElementWithLabelVisible(newActivity.title)
        })
      }
      if (newActivity.uploadFiles) {
        super.getTabPanelItemRowByLabel('File:').within(($item) => {
          cy.expectElementWithLabelVisible(oldActivity.uploadFiles.name[0])
          cy.hasSvgIcon()
          cy.expectElementWithLabelVisible(newActivity.uploadFiles.name[0], 'span')
        })
      }
      if (newActivity.description) {
        super.getTabPanelItemRowByLabel('Description:').within(() => {
          super.getPanelPrevious().within(() => {
            cy.expectElementWithLabelVisible(oldActivity.description, 'div')
          })
          super.getPanelNew().within(() => {
            cy.expectElementWithLabelVisible(newActivity.description, 'div')
          })
        })
      }
    })
  }

  expectADetailLogBold(logLabel, value) {
    cy.expectElementWithLabelVisible(logLabel, 'b')
      .parent()
      .invoke('text')
      .then((text) => expect(text).contains(value))
  }

  expectADetailLogStrong(logLabel, value) {
    cy.expectElementWithLabelVisible(logLabel, 'strong').parent().contains(value)
  }
}
