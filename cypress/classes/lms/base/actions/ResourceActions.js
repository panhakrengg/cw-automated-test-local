import Field from '../../../constants/Field'
import { ResourceConstant } from '../constant/ResourceConstant'
import ResourceItc from '../intercepts/ResourceItc'
import ResourceQueries from '../queries/ResourceQueries'

export default class ResourceActions extends ResourceQueries {
  #setItcFetchResources() {
    ResourceItc.fetchFaciResource.set()
    ResourceItc.fetchLearnerResource.set()
  }

  #waitItcFetchResources() {
    super.isFacilitatorPage().then((faciPage) => {
      if (faciPage) ResourceItc.fetchFaciResource.wait()
      else ResourceItc.fetchLearnerResource.wait()
    })
  }

  clickDelete() {
    ResourceItc.deleteResourceManageCourse.set()
    this.#setItcFetchResources()

    cy.clickButtonByName(Field.DELETE)
    cy.swal2Confirm(Field.YES_DELETE).click()

    ResourceItc.deleteResourceManageCourse.wait()
    this.#waitItcFetchResources()
    cy.waitUntilIconLoadingLgNotExist()
  }

  selectAllFileFolders() {
    cy.cecTable().within(() => {
      cy.getCheckbox().each(($checkBox) => {
        cy.wrap($checkBox).check()
      })
    })
  }

  #clickButtonDone() {
    this.#setItcFetchResources()
    cy.clickButtonByName(Field.DONE)
    this.#waitItcFetchResources()
  }

  #clickButtonCreate() {
    this.#setItcFetchResources()
    cy.clickButtonByName(Field.CREATE)
    this.#waitItcFetchResources()
  }

  deleteAllFilesAndFoldersIfExist() {
    super.findFileFolder().then((found) => {
      if (found) {
        this.selectAllFileFolders()
        this.clickDelete()
      }
    })
  }

  uploadFiles(paths) {
    super.isFacilitatorPage().then((faciPage) => {
      cy.clickButtonByName(Field.UPLOAD)
      paths.forEach((path) => {
        if (faciPage) cy.uploadFile(path, ResourceItc.uploadFileFaci)
        else cy.uploadFile(path, ResourceItc.uploadFileLearner)
      })
    })
    this.#clickButtonDone()
  }

  createNewFolder(name) {
    cy.clickButtonByName(ResourceConstant.NEW_FOLDER)
    super.getInputFolderName().type(name)
    this.#clickButtonCreate()
  }

  clickFolder(name) {
    this.#setItcFetchResources()
    cy.getElementWithLabel(name, 'td span').click()
    this.#waitItcFetchResources()
  }

  #createFolders(folders) {
    for (const [key, value] of Object.entries(folders)) {
      this.createNewFolder(value.name)
    }
  }

  #clickRootBreadcrumb() {
    this.#setItcFetchResources()
    super.getBreadcrumbRoot().click()
    this.#waitItcFetchResources()
    cy.waitUntilIconLoadingLgNotExist()
  }

  #uploadFilesInFolders(folders) {
    for (const [key, value] of Object.entries(folders)) {
      const { name, files } = value
      if (files) {
        this.clickFolder(name)
        this.uploadFiles(files.path)
        this.#clickRootBreadcrumb()
      }
    }
  }

  resetUploadFileAndCreateFolder(resources) {
    cy.log(resources)
    const { files, folders } = resources

    this.deleteAllFilesAndFoldersIfExist()
    if (files) this.uploadFiles(files.path)
    if (folders) {
      this.#createFolders(folders)
      this.#uploadFilesInFolders(folders)
    }
  }
}
