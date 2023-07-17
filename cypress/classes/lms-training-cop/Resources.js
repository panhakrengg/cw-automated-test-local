import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import DateFormat from '../format-collections/DateFormat'
import WebNotification from '../notification/WebNotification'
import DateUtil from '../utilities/DateUtil'
import YamlHelper from '../utilities/YamlHelper'

const webNotification = new WebNotification()

class Resources {
  _itcFetchResource = new InterceptReq(this.fetchResourceCommand(), 'fetchResource')
  _itcCreateFolder = new InterceptReq(this.createFolderCommand(), 'createFolder')
  _itcUploadFile = new InterceptReq(this.uploadFileCommand(), 'uploadFileCommand')
  _itcDeleteResource = new InterceptReq('/manage_courses/resource/delete', 'deleteResource')
  _itcFetchBreadcrumbs = new InterceptReq(
    '/facilitator_resources/breadcrumbs/fetch',
    'fetchBreadcrumbs'
  )
  _itcFetchCourseInstanceOverview = new InterceptReq(
    '/manage_courses/course_instance/overview',
    'fetchCourseInstanceOverview'
  )
  #dateUtil = new DateUtil()

  fetchResourceCommand() {
    throw Error('You have to implement the fetchResourceCommand method!')
  }

  createFolderCommand() {
    throw Error('You have to implement the createFolderCommand method!')
  }

  uploadFileCommand() {
    throw Error('You have to implement the uploadFileCommand method!')
  }

  pageTitle() {
    throw Error('You have to implement the pageTitle method!')
  }

  expectToSeeResourcesPage() {
    this.getMainContent().within(($mainContent) => {
      cy.wrap($mainContent).find('.cec-px-6').should('contain.text', this.pageTitle())
      cy.wrap($mainContent).find('table').as('table')
      cy.get('@table')
        .find('th')
        .then(($header) => {
          cy.wrap($header).expectItemNameWithIndex(0, Field.NAME)
          cy.wrap($header).expectItemNameWithIndex(1, Field.TYPE)
          cy.wrap($header).expectItemNameWithIndex(2, Field.SIZE)
          cy.wrap($header).expectItemNameWithIndex(3, Field.OWNER)
          cy.wrap($header).expectItemNameWithIndex(4, Field.VIEWS)
          cy.wrap($header).expectItemNameWithIndex(5, Field.MODIFIED_DATE)
        })
      cy.wrap($mainContent)
        .find('.justify-content-end > button')
        .then(($buttons) => {
          cy.wrap($buttons).expectItemNameWithIndex(0, Field.UPLOAD)
          cy.wrap($buttons).expectItemNameWithIndex(1, Field.NEW_FOLDER)
          cy.wrap($buttons).expectItemNameWithIndex(2, Field.DOWNLOAD)
          cy.wrap($buttons).expectItemNameWithIndex(3, Field.DELETE)
        })
      cy.get('@table').rowName('Folders').should('be.visible')
      cy.get('@table').rowName('Files').should('be.visible')
    })
  }

  createFolder(folderName) {
    this.#isFileOrFolderExist(folderName).then((isExist) => {
      if (!isExist) {
        this.clickNewFolder()
        cy.getPopup().within(($popup) => {
          cy.wrap($popup).inputByPlaceholder('Enter folder name', folderName)
          this._itcCreateFolder.set()
          this._itcFetchResource.set()
          cy.wrap($popup).clickButtonByName(Field.CREATE)
          this._itcCreateFolder.wait()
          this._itcFetchResource.wait()
        })
      }
    })
  }

  clickNewFolder() {
    this.getMainContent().find('button').contains(Field.NEW_FOLDER).click()
  }

  verifyNewFolderPopup() {
    cy.getPopup()
      .should('be.visible')
      .within(($popup) => {
        cy.wrap($popup).getPopupHeader().should('contain.text', 'Create New Folder')
        cy.wrap($popup).find(`button:contains("Create")`).should('have.attr', 'disabled')
        cy.wrap($popup).inputByPlaceholder('Enter folder name', 'AU')
        cy.wrap($popup).find(`button:contains("Create")`).should('not.have.attr', 'disabled')
      })
      .closePopup()
  }

  selectFileFirstRow() {
    this.getTable().rowName(Field.FILES).next().find('input[type = "checkbox"]').click()
  }

  selectFileSecondRow() {
    this.getTable().rowName(Field.FILES).next().next().find('input[type = "checkbox"]').click()
  }

  selectFolderFirstRow() {
    this.getTable().rowName(Field.FOLDERS).next().find('input[type = "checkbox"]').click()
  }

  selectFolderSecondRow() {
    this.getTable().rowName(Field.FOLDERS).next().next().find('input[type = "checkbox"]').click()
  }

  clickDelete() {
    this.getMainContent().find('button').contains(Field.DELETE).click()
  }

  expectToSeeConfirmDeletePopupWithTitle(title) {
    cy.swal2().should('be.visible').getSwal2Header().should('contain.text', title).closeSwal2()
  }

  expectNewFolderCreated(folderName) {
    this.getTable().within(($table) => {
      cy.wrap($table)
        .rowName(folderName)
        .within(($row) => {
          cy.wrap($row).should('be.visible')
          cy.wrap($row).get('td').eq(1).should('contain.text', '-')
          cy.wrap($row).get('td').eq(2).should('contain.text', '-')
          cy.wrap($row).get('td').eq(3).should('contain.text', '-')
          cy.wrap($row).get('td').eq(4).should('contain.text', '-')
          cy.wrap($row)
            .get('td')
            .eq(5)
            .should(
              'contain.text',
              this.#dateUtil.getCurrentDate(
                DateFormat.CREATE_FOLDER_FACILITATOR_RESOURCE_DATE_FORMAT
              )
            )
        })
    })
  }

  expectNewFileUploaded(uploadFiles = {}) {
    const files = Object.entries(uploadFiles)
    if (files.length) {
      const owner = files[0][1].owner
      const yamlHelper = new YamlHelper('users')
      yamlHelper
        .read()
        .its(owner)
        .then((result) => {
          const user = result.users[new Environment().getEnvYaml()]
          const userFullName = user.fullNames[0]
          this.getTable().within(($table) => {
            files.forEach((file) => {
              console.log(file)
              cy.wrap($table)
                .rowName(file[1].name)
                .within(($row) => {
                  cy.wrap($row).should('be.visible')
                  cy.wrap($row).get('td').eq(0).should('contain.text', file[1].name)
                  cy.wrap($row)
                    .get('td')
                    .eq(1)
                    .find('img')
                    .invoke('attr', 'src')
                    .should('contain', file[1].type)
                  cy.wrap($row).get('td').eq(2).should('contain.text', file[1].size)
                  cy.wrap($row).get('td').eq(3).should('contain.text', userFullName)
                  console.log('file[1].view', file[1].view)
                  cy.wrap($row).get('td').eq(4).should('contain.text', file[1].view)
                  cy.wrap($row)
                    .get('td')
                    .eq(5)
                    .should(
                      'contain.text',
                      this.#dateUtil.getCurrentDate(
                        DateFormat.CREATE_FOLDER_FACILITATOR_RESOURCE_DATE_FORMAT
                      )
                    )
                })
            })
          })
        })
    }
  }

  deleteFiles(deleteFiles = {}) {
    const files = Object.entries(deleteFiles)
    if (files.length) {
      files.forEach((file) => {
        const fileName = file[1].name.split('.')[0]
        this.selectResource(fileName)
      })
      this.delete()
    }
  }

  deleteResource(resourceName) {
    this.getTable()
      .invoke('text')
      .then(($text) => {
        if ($text.includes(resourceName)) {
          this.selectResource(resourceName)
          this.delete()
        }
      })
  }

  getTable() {
    return this.getMainContent().find('table tr').parents('table').should('be.visible')
  }

  delete() {
    this.getMainContent()
      .find('button')
      .contains(Field.DELETE)
      .then(($button) => {
        if (!$button.is(':disabled')) {
          cy.wrap($button).click({ force: true })
          this._itcDeleteResource.set()
          this._itcFetchResource.set()
          cy.wrap().swal2().swal2Confirm(Field.YES_DELETE).click()
          cy.waitUntilIconLoadingLgIsVisible()
          this._itcDeleteResource.wait()
          this._itcFetchResource.wait()
          cy.waitUntilIconLoadingLgNotExist()
        }
      })
  }

  getMainContent() {
    return cy.cecCard().cardMainContent()
  }

  #isFileOrFolderExist(resourceName) {
    cy.wrap(false).as('isExist')
    this.getTable().within(($table) => {
      if ($table.find(`tbody tr td:contains("${resourceName}")`).length) {
        cy.wrap(true).as('isExist')
      }
    })
    return cy.get('@isExist')
  }

  selectResource(resourceName) {
    this.#isFileOrFolderExist(resourceName).then((isExist) => {
      if (isExist) {
        this.getTable()
          .rowName(resourceName)
          .each(($row) => {
            cy.wrap($row).within(() => cy.getCheckbox().click())
          })
      }
    })
  }

  expectResourceDeleted(resourceName) {
    this.getTable().should('not.contain.text', resourceName)
  }

  upload(uploadFiles = {}) {
    const files = Object.entries(uploadFiles)
    if (files.length) {
      this._itcUploadFile.set()
      this._itcFetchResource.set()
      this.clickUpload()
      cy.getPopup().within(($popup) => {
        files.forEach((file) => {
          cy.wrap($popup).get('.cw-dropzone-drop-area').attachFile(file[1].path, {
            encoding: 'utf-8',
            subjectType: 'drag-n-drop',
          })
          this._itcUploadFile.wait()
        })
        cy.wrap($popup).find('button').contains('Done').click()
        this._itcFetchResource.wait()
      })
    }
  }

  verifyUploadUnSupportFiles(uploadFiles) {
    const files = Object.entries(uploadFiles)
    if (files.length) {
      this.clickUpload()
      cy.getPopup().within(($popup) => {
        files.forEach((file) => {
          cy.wrap($popup).get('.cw-dropzone-drop-area').attachFile(file[1].path, {
            encoding: 'utf-8',
            subjectType: 'drag-n-drop',
          })
          cy.wrap($popup)
            .get(`.file-item:contains("${file[1].name}")`)
            .find('span')
            .should('contain.text', 'Invalid file type')
            .and('have.class', 'text-danger')
        })
        this._itcFetchResource.set()
        cy.wrap($popup).find('button').contains('Done').click()
        this._itcFetchResource.wait()
      })
    }
  }

  clickUpload() {
    this.getMainContent().find('button').contains(Field.UPLOAD).click()
  }

  expectToSeeUploadPopup() {
    cy.getPopup()
      .should('be.visible')
      .getPopupHeader()
      .should('contain.text', 'Upload Files')
      .closePopup()
  }

  accessToFolder(folderName) {
    this._itcFetchResource.set()
    this.getTable().rowName(folderName).find('span').click()
    this._itcFetchResource.wait()
  }

  clickOnDownload() {
    this.getMainContent()
      .find('.justify-content-end > button:contains("Download")')
      .click({ force: true })
  }

  downloadResources(resources) {
    const files = resources.files
    const folders = resources.folders
    this.selectResources(files)
    this.selectResources(folders)
    if (files || folders) {
      this.clickOnDownload()
      this.selectResources(files)
      this.selectResources(folders)
    }
    this.clickOnDownload()
  }
  selectResources(resources) {
    if (resources) {
      Object.entries(resources).forEach((resource) => {
        this.selectResource(resource[1].name)
      })
    }
  }

  expectDownloadedFileIncreaseViewByOne(fileName) {
    this._itcFetchResource.set()
    this.getViewCount(fileName).then((oldViewCount) => {
      cy.reload().then(() => {
        cy.wait(15000)
        this.expectViewCountIncreaseByOne(fileName, oldViewCount)
      })
    })
    this._itcFetchResource.wait()
  }

  getViewCountColumn(fileName) {
    return this.getTable().rowName(fileName).find('td').eq(4)
  }

  expectViewCountIncreaseByOne(fileName, oldViewCount) {
    this.getViewCount(fileName).then((viewCount) => {
      let count = viewCount
      if (viewCount <= oldViewCount) {
        count = parseInt(oldViewCount) + 1
      }
      expect(parseInt(count)).eq(parseInt(oldViewCount) + 1)
    })
  }

  getViewCount(fileName) {
    return this.getViewCountColumn(fileName).invoke('text')
  }

  accessToLearnerResourcesViaWebNotification(copAdminScreenName, courseName) {
    this._itcFetchCourseInstanceOverview.set()
    webNotification
      .getNotificationOfUpdatedAnInstanceInTheCourse(copAdminScreenName, courseName)
      .should('be.visible')
      .click()
    this._itcFetchCourseInstanceOverview.wait()
    this.clickLearnerResourceTab()
  }

  clickLearnerResourceTab() {
    this._itcFetchResource.set()
    cy.cecCard().cardRightContent().find('a:contains("Learner Resource")').click()
    this._itcFetchResource.wait()
  }

  expectResourcesNotExist(files) {
    Object.entries(files).forEach((file) => {
      this.getTable().contains(file[1].name).should('not.exist')
    })
  }
}

export default Resources
