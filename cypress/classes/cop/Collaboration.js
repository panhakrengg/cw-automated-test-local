import Field from '../constants/Field'

class Collaboration {
  FOLDER_NAME = 'for-tracking-activity-log-1668160650776'
  UPDATE_FOLDER_NAME = this.FOLDER_NAME + '-update'
  FILE_NAME = 'for-tracking-activity-log-1668160650774'
  UPDATE_FILE_NAME = this.FILE_NAME + '-update'

  visitFileSharing(copName) {
    cy.visit(`/web/${copName}/collaboration/file-sharing`)
  }
  clickFileSharingCommunityFolder() {
    cy.getElementWithLabel('Community Files', '#uploadFileSharingMessage').click()
  }
  clickThreeDotInFileSharingDetailBy(itemName, fileName) {
    cy.get(`span:contains(${fileName})`)
      .parents('tr')
      .find('td')
      .last()
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(itemName)
      })
  }
  clickFolderThreeDotInFileSharingDetailBy(itemName, folderName) {
    this.clickThreeDotInFileSharingDetailBy(itemName, folderName)
  }
  clickFileThreeDotInFileSharingDetailBy(itemName, fileName) {
    this.clickThreeDotInFileSharingDetailBy(itemName, fileName)
  }
  fillInRename(name) {
    cy.swal2().then(() => {
      cy.get('#edit-name').clear().type(name).blur()
    })
  }
  clickButtonSaveRename() {
    cy.swal2().then(() => {
      cy.buttonNotDisabled()
      cy.btnConfirm(Field.SAVE).click()
    })
  }
  renameFile(newName, threeDotItemName, oldName) {
    this.clickFileThreeDotInFileSharingDetailBy(threeDotItemName, oldName)
    this.fillInRename(newName)
    this.clickButtonSaveRename()
  }
  renameFolder(newName, threeDotItemName, oldName) {
    this.clickFolderThreeDotInFileSharingDetailBy(threeDotItemName, oldName)
    this.fillInRename(newName)
    this.clickButtonSaveRename()
  }
  checkFileOrFolderIsAlreadyUpdated(fileOrFolderName) {
    return new Promise((resolve, reject) => {
      cy.cwTable().then(($table) => {
        const isUpdated = $table.find(`span:contains(${fileOrFolderName})`).length > 0
        resolve(isUpdated)
      })
    })
  }
  renameFileOrFolderIfExist(oldName, newName) {
    cy.wrap(this.checkFileOrFolderIsAlreadyUpdated(oldName)).then(($isUpdated) => {
      if ($isUpdated) {
        this.renameFolder(newName, 'Rename', oldName)
      }
    })
  }
}

export default Collaboration
