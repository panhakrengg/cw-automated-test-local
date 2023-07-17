import { DropdownMenu } from './FileSharingConstant'
import InterceptRequestAction from './operation/InterceptRequestAction'

class ResourceDisplay {
  setViewFileOrFolder() {
    cy.get('#portlet_resourceDisplayPortlet .cec-card__body').as('viewFileOrFolder')
  }

  clickViewFolder() {
    this.setViewFileOrFolder()
    cy.get('@viewFileOrFolder').getCwSplitDropdown().find('button.btn-action-default').click()
    InterceptRequestAction._itcFetchFolderDetails.wait()
    InterceptRequestAction._itcFetchRepositorySize.wait()
  }

  openFileLocation() {
    this.setViewFileOrFolder()
    cy.get('@viewFileOrFolder').clickCwSplitDropdownItem(DropdownMenu.openFileLocation)
  }

  expectDisplayAsFile(name, size) {
    const fileSizeDisplay = `Download (${size})`
    cy.get('.ml-4 .cw-header__link').should('contain', name)
    cy.expectDefaultCwSplitDropdown(fileSizeDisplay)
  }
}

export default ResourceDisplay
