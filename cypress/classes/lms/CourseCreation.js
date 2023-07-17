import Environment from '../base/Environment'
import InterceptRender from '../base/InterceptRender'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import { CoPConst } from '../lms-training-cop/base/CoPStub'
import { OrgConst } from '../org-management/base-org-management/OrgStub'

class CourseCreation {
  _createCourseCrosswiredUrl =
    '/web/full-catalog/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fmanage_courses%2Fnew_course'
  _bannerImagePathPrefix = ''
  _fileUploadPathPrefix = ''
  _trainingLmsBannerFixture = 'lms-training-cop/courses/banner/'
  _trainingLmsFileFixture = 'lms-training-cop/courses/file/'

  _itcFetchHelpGuideUrl = new InterceptReq(
    '/manage_courses/fetch_help_guide_url',
    'FetchHelpGuideUrl'
  )
  _itcCourseProperties = new InterceptReq('/course/properties', 'CourseProperties')
  _itcModifyCourse = new InterceptReq('/manage_course/course/modify', 'ModifyCourse')
  _itcFetchCourse = new InterceptReq('/manage_courses/fetch_course', 'FetchCourse')
  _itcRenderManageCourse = new InterceptRender(`${CoPConst.URL}/admin/admin`, 'RenderManageCourse')
  _itcTempFileUpload = new InterceptReq('/manage_courses/temp_file/upload', 'TempFileUpload')
  setTrainingLmsBannerFixture() {
    this._bannerImagePathPrefix = this._trainingLmsBannerFixture
  }
  setTrainingLmsFileFixture() {
    this._fileUploadPathPrefix = this._trainingLmsFileFixture
  }
  setBannerImagePathPrefix(path) {
    this._bannerImagePathPrefix = path
  }
  setFileUploadPathPrefix(path) {
    this._fileUploadPathPrefix = path
  }

  getCreateCourseOrgUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fmanage_courses%2Fnew_course`
  }

  goToCreateCoursePage(url = this.getCreateCourseOrgUrl()) {
    this._itcCourseProperties.set()
    this._itcFetchHelpGuideUrl.set()
    cy.visit(url)
    this._itcCourseProperties.wait()
    this._itcFetchHelpGuideUrl.wait()
  }
  clickCreateNewCourse(option) {
    cy.get('.cw-top-header').within(() => {
      this._itcCourseProperties.set()
      this._itcFetchHelpGuideUrl.set()
      cy.contains('button', 'Create New Course').as('btnCreateNewCourse')
      cy.get('@btnCreateNewCourse').should('have.class', 'text-uppercase').click()
      if (option) {
        this.chooseOptionToCreateNewCourse(option)
      }
      this._itcCourseProperties.wait()
      this._itcFetchHelpGuideUrl.wait()
    })
  }
  chooseOptionToCreateNewCourse(option) {
    cy.get('@btnCreateNewCourse')
      .swal2()
      .getSwal2Content()
      .within(() => {
        cy.contains('.row', option).click()
        cy.contains('button', Field.NEXT).click()
      })
  }
  verifyRequiredFields() {
    this.defineAliasFormElements()
    cy.get('@btnSaveAsDraft').should('be.disabled')
    cy.get('@inputCourseTitle').type('Course Title')
    cy.get('@btnSaveAsDraft').should('be.disabled')
    cy.get('@courseOverviewWrapper').typeInEditor('Course Overview')
    cy.get('@btnSaveAsDraft').should('not.be.disabled')
    cy.get('@inputCourseTitle').clear()
    cy.get('@btnSaveAsDraft').should('be.disabled')
  }
  defineAliasFormElements(isEdit) {
    cy.get('.course-detail-wrapper').within(() => {
      cy.cecCard().cardMainContent()
    })
    cy.get('@cardMainContent').within(($MainContent) => {
      cy.getInput('text', 'Enter the title of the course').as('inputCourseTitle')
      cy.get('.image-upload-container')
        .contains('button', !isEdit ? 'Add a Course Image' : 'Change Photo')
        .as('btnAddCourseImage')
      cy.contains('label', 'Course Overview').parent().as('courseOverviewWrapper')
      cy.contains('label', 'Course Fee').parent().as('courseFee')
      cy.get('.cw-dropzone').parent().as('fileUploadWrapper')
    })
    cy.get('@cecCard')
      .cardRightContent()
      .contains('button', !isEdit ? 'Save as Draft' : 'Save Course')
      .as('btnSaveAsDraft')
  }
  create(course) {
    this.defineAliasFormElements()
    cy.get('@inputCourseTitle').type(course['name'])
    if (course['bannerImage']) {
      this.uploadCourseBannerCoP(course['bannerImage'])
    }
    cy.get('@courseOverviewWrapper').typeInEditor(course['courseOverview'])
    this.triggerSaveAsDraft()
  }
  update(course, revertDataCallback) {
    if (revertDataCallback) {
      cy.wrap(null).then(() => {
        this.defineAliasFormElements(true)
        revertDataCallback()
      })
    }
    this.edit(course)
    this.triggerSaveAsDraft()
  }
  edit(course) {
    this.defineAliasFormElements(true)
    cy.get('@inputCourseTitle').clear().type(course['name'])
    if (course['bannerImage']) {
      this.uploadCourseBannerCoP(course['bannerImage'])
    }
    cy.get('@courseOverviewWrapper').clearTextEditor()
    cy.get('@courseOverviewWrapper').typeInEditor(course['courseOverview'])
    cy.get('@courseFee').typeInput(course['courseFee']['value'], 'number')
    if (course['attachment']) {
      this.removeThenUploadFile(course['attachment'])
    }
    if (course['tagSkill']) {
      this.selectTagsAndSkills(course['tagSkill'])
    }
  }
  selectTagsAndSkills(tagSkill) {
    cy.contains('label', 'Tags and Skills')
      .parent()
      .within(() => {
        if (Array.isArray(tagSkill)) {
          tagSkill.forEach((element) => {
            cy.contains('span', element).click()
          })
        } else {
          cy.contains('span', tagSkill).click()
        }
      })
  }

  uploadFile(attachments) {
    if (Array.isArray(attachments)) {
      attachments = attachments.map((a) => this._fileUploadPathPrefix + a)
    } else {
      attachments = this._fileUploadPathPrefix + attachments
    }
    cy.get('@fileUploadWrapper').within(() => {
      this._itcTempFileUpload.set()
      cy.contains('button.btn-outline-primary', 'Select Files').chooseFile(
        attachments,
        'cw-dropzone-file'
      )
      this._itcTempFileUpload.wait()
    })
  }

  removeThenUploadFile(attachments) {
    cy.get('@fileUploadWrapper').within(() => {
      cy.get('a > svg.cw-icon-trash').each(() => {
        cy.get('a > svg.cw-icon-trash:first').parent().click()
      })
    })
    this.uploadFile(attachments)
  }

  uploadCourseBanner(imagePath, isCoP = false) {
    cy.get('@btnAddCourseImage').chooseFile(this._bannerImagePathPrefix + imagePath)
    cy.get('@cardMainContent').swal2().getSwal2Content().as('bannerImagePopup')
    cy.get('@bannerImagePopup').find('div.cr-overlay').should('be.visible')
    this._itcRenderManageCourse.set()
    cy.get('@bannerImagePopup').contains('button', Field.SAVE).click()
    if (isCoP) this._itcRenderManageCourse.wait()
    cy.get('.cw-form-image-wrapper > .image__wrapper').within(() => {
      cy.scrollTo('top') //Hack to show the lazy load banner image
      cy.get('> img')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0)
    })
  }
  uploadCourseBannerCoP(imagePath) {
    this.uploadCourseBanner(imagePath, true)
  }

  selectCategories(categories) {
    cy.clickButtonByName('Select Categories')
    cy.swal2().within(() => {
      categories.forEach((category) => {
        cy.checkboxByLabel(category).check()
      })
      cy.clickButtonByName(Field.SAVE)
    })
  }

  #getCourseId(courseName) {
    cy.url().then((url) => {
      url = url.split('CoursesPortlet_id=').pop().split('&_learningAdmin')[0]
      cy.log(`CourseId in ${new Environment().getEnvPrefix()} "${courseName}" ${url}`)
    })
  }

  triggerSaveAsDraft(courseName) {
    this._itcModifyCourse.set()
    this._itcFetchCourse.set()
    this._itcCourseProperties.set()
    cy.get('@btnSaveAsDraft').click()
    this._itcModifyCourse.wait()
    this._itcFetchCourse.wait()
    if (courseName) this.#getCourseId(courseName)
  }
  expectSaveCourseToastMessage() {
    cy.expectToastMessage('The course has been saved.')
  }
  expectSaveCourseButtonDisabled() {
    cy.get('@btnSaveAsDraft').should('have.attr', 'disabled', 'disabled')
  }
}

export default CourseCreation
