import InterceptRender from '../base/InterceptRender'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import BaseManageCourse from '../lms/base-manage-course/BaseManageCourse'
import WebNotification from '../notification/WebNotification'
import Node from '../utilities/Node'
import SignInAs from '../utilities/SignInAs'
import LmsManagementHelper from './base-manage-course/LmsManagementHelper'
import { CoPConst } from './base/CoPStub'

class CopManageCourse extends BaseManageCourse {
  constructor(course) {
    super(course)
  }

  _courseHasInstance3Dots = [
    'Overview',
    'Edit',
    'Course Instances',
    'Create an instance',
    'Facilitator Resources',
    'Training Reports',
    'People',
  ]
  _courseNoInstance3Dots = [
    'Overview',
    'Edit',
    'Delete',
    'Course Instances',
    'Create an instance',
    'Facilitator Resources',
    'Training Reports',
    'People',
  ]
  _courseInstance3Dots = [
    'View',
    'Edit',
    'Duplicate',
    'Delete',
    'Training Reports',
    'Learner Resources',
    'View Discussion',
  ]
  _orgTagsAndSkills = [
    'Compliance & Leadership',
    'Cross-cultural Discipleship',
    'Member Health & Well-Being',
    'Missiology & Evangelism',
    'Online Communities',
    'Spiritual Formation',
  ]
  _createNewCourseLabel = 'Create New Course'
  _copAdminUrl
  _course

  _itcRenderCopAdmin = new InterceptRender(`${CoPConst.URL}/admin/admin`, 'RenderCopAdmin')
  _itcFetchCourse = new InterceptReq('/manage_courses/fetch', 'FetchCourse')
  _itcFetchCourses = new InterceptReq('/manage_courses/fetch_course', 'FetchCourses')
  _itcFetchCourseOption = new InterceptReq(
    '/manage_courses/fetch_course_options',
    'FetchCourseOption'
  )
  _itcCourseProperties = new InterceptReq('/course/properties', 'CourseProperties')
  _itcUpdateCourseStatus = new InterceptReq('/course/update_status', 'UpdateCourseStatus')
  _itcCourseInstanceOverview = new InterceptReq(
    '/manage_courses/course_instance/overview',
    'FetchCourseInstanceOverview'
  )
  _itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'FetchCourseActivities'
  )
  _itcCourseInstanceOptions = new InterceptReq(
    '/manage_courses/course_instance/options',
    'CourseInstanceOptions'
  )
  _itcAdminGetMembers = new InterceptReq('/admin/get_members', 'AdminGetMembers')
  _itcCourseInstancePublish = new InterceptReq(
    '/manage_courses/course_instance/publish',
    'FetchCourseInstance'
  )
  _itcFetchCourseInstance = new InterceptReq(
    '/manage_courses/course_instance/fetch',
    'FetchCourseInstance'
  )
  _itcDeleteCourse = new InterceptReq('/manage_courses/delete', 'DeleteCourse')
  _itcSearchAdminSharedCourse = new InterceptReq(
    '/admin/shared_courses/search',
    'FetchAdminSharedCourse'
  )
  _itcFetchAdminSharedCourseOption = new InterceptReq(
    '/admin/shared_course/fetch_options',
    'FetchAdminSharedCourseOption'
  )
  setCopAdminUrl(url) {
    this._copAdminUrl = url + '/admin/admin'
  }
  setCourse(data) {
    this._course = data
  }
  getCourse() {
    return this._course
  }
  getCourseUrl(courseId, tab = 'course-overview') {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=${tab}`
  }
  goToCourseOverview(courseId) {
    this._itcFetchCourses.set()
    this._itcCourseProperties.set()
    cy.visit(`${this._copAdminUrl}${this.getCourseUrl(courseId)}`)
    this._itcFetchCourses.wait()
    this._itcCourseProperties.wait()
  }
  goToEditCourse(courseId, reload) {
    this._itcRenderCopAdmin.set()
    this._itcFetchCourses.set()
    if (reload) {
      cy.reload()
    } else {
      cy.visit(`${this._copAdminUrl}${this.getCourseUrl(courseId, 'edit-course')}`)
    }
    this._itcRenderCopAdmin.wait()
    this._itcFetchCourses.wait()
  }
  goToManageCourse(reload) {
    this._itcFetchCourse.set()
    this._itcFetchCourseOption.set()
    if (reload) cy.reload()
    else this.visitManageCourse()
    this._itcFetchCourseOption.wait()
    this._itcFetchCourse.wait()
    cy.waitLoadingOverlayNotExist()
  }
  #getBaseCourseTitleWrapper(callback = () => {}) {
    this.defineAliasCourseWrapper()
    cy.get('@courseWrapper')
      .find('.pull-right')
      .within(($wrapper) => {
        callback($wrapper)
      })
  }
  clickOnCourseThreeDotOption(trainingReport, threeDotOption) {
    this.#getBaseCourseTitleWrapper(($wrapper) => {
      trainingReport.itcFetchTrainingReport.set()
      cy.wrap($wrapper).clickDropdownItem(threeDotOption)
      trainingReport.itcFetchTrainingReport.wait()
    })
  }
  clickOnCourseInstanceThreeDotOption(instanceDate, threeDotOption) {
    this.getCourseInstancesBy(this.getCourseName(), instanceDate).then(($instance) => {
      cy.wrap($instance).within(($ci) => {
        cy.wrap($ci).getThreeDots().click()
        cy.wrap($ci).clickDropdownName(threeDotOption)
      })
    })
  }
  visitManageCourse(options) {
    cy.visit(`${this._copAdminUrl}#_copMemberManagementPortlet_option=manage-courses`, options)
  }
  defineAliasDropDownOptions() {
    cy.get('div.admin-panel-wrapper').within(() => {
      cy.get('div.cw-learning-dropdown__wrapper').as('dropDownOptions')
    })
  }
  defineAliasCourseWrapper() {
    cy.get('div.admin-panel-wrapper').within(() => {
      cy.contains('p.font-weight-bold', this.getCourseName()).parent().as('courseWrapper')
    })
  }
  deleteCoursesInDraft() {
    cy.get(`p.font-weight-bold > a:contains("${this.getCourseName()}")`).each(() => {
      this.deleteCourse()
      this.searchCourseWithFilter(Field.DRAFT)
    })
  }
  deleteCourse() {
    cy.get('@courseWrapper').within(($courseWrapper) => {
      cy.wrap($courseWrapper).clickDropdownItem(Field.DELETE)
    })
    this._itcFetchCourse.set()
    this._itcDeleteCourse.set()
    cy.get('@courseWrapper').swal2().swal2Confirm(Field.YES_DELETE).click()
    this._itcDeleteCourse.wait()
    this._itcFetchCourse.wait()
  }
  searchCourseWithFilter(option = Field.CURRENT) {
    this.defineAliasDropDownOptions()
    this._itcFetchCourse.set()
    if (option !== Field.CURRENT) {
      cy.get('@dropDownOptions')
        .first()
        .within(($filter) => {
          cy.wrap($filter).click()
          cy.wrap($filter).clickDropdownName(option)
        })
      this._itcFetchCourse.wait()
    }
    cy.get('div.cw-top-header__search-input').typeInput(`"${this.getCourseName()}" {enter}`)
    this._itcFetchCourse.wait()
    cy.waitLoadingOverlayNotExist()
    cy.wait(5000)
  }
  wrapObjectKeyValue(object, index = 0) {
    return `${this.toCapitalLetter(object[index].key)} (${object[index].value})`
  }
  toCapitalLetter(str) {
    return str.slice(0, 1).toUpperCase() + str.substring(1)
  }
  get3DotsItemName() {
    const itemNames = []
    return cy
      .getDropdownList()
      .each(($el) => itemNames.push($el.text().replace(/\s+/g, ' ').trim()))
      .then(() => cy.wrap(itemNames))
  }
  getCourseName() {
    return this._course['name']
  }
  verifyFilterAndSortOptions() {
    this.defineAliasDropDownOptions()
    this._itcFetchCourseOption
      .getResponse()
      .its('response.body.result')
      .then((result) => {
        this.verifyFilterOptions(result['filterOptions'])
        this.verifySortOptions(result['sortingOptions'])
      })
  }
  verifyFilterOptions(options) {
    cy.get('@dropDownOptions')
      .first()
      .within(() => {
        this.verifyDropDownDefaultValue(this.wrapObjectKeyValue(options))
        cy.getDropdownList().each(($el, index) => {
          if (options[index].key == 'pending-approval') {
            cy.wrap($el).contains('Pending Approval').should('exist')
          } else {
            cy.wrap($el).contains(this.wrapObjectKeyValue(options, index)).should('exist')
          }
        })
      })
  }
  verifySortOptions(options) {
    cy.get('@dropDownOptions')
      .last()
      .within(() => {
        this.verifyDropDownDefaultValue(`Sort by: ${options[0].value}`)
        cy.getDropdownList().each(($el, index) => {
          cy.wrap($el).contains(options[index].value).should('exist')
        })
      })
  }
  verifySortCoursesByTitle(sortDescending) {
    this.defineAliasDropDownOptions()
    if (sortDescending) {
      this._itcFetchCourse.set()
      cy.get('@dropDownOptions').last().clickCwSplitDropdownToggle('Course Name (Z-A)')
      this._itcFetchCourse.wait()
      cy.waitLoadingOverlayNotExist()
    }
    this._itcFetchCourse
      .getResponse()
      .its('response.body.result')
      .then((result) => {
        if (sortDescending) {
          cy.wrap(result.map((c) => c['title'])).expectSortDescending()
        } else {
          cy.wrap(result.map((c) => c['title'])).expectSortAscending()
        }
      })
  }
  verifyDropDownDefaultValue(value) {
    cy.getDropdownButtonSelected(value).hasSvgIcon()
  }
  verifyCourse3DotsAndDeleteConfirm(deletable) {
    this.defineAliasCourseWrapper()
    cy.get('@courseWrapper').within(() => {
      cy.get('> .pull-right').within(($threeDots) => {
        cy.wrap($threeDots).getThreeDots()
        if (deletable) {
          cy.wrap($threeDots).clickDropdownItem(Field.DELETE)
          cy.get('@cwThreeDots').verifySwal2Confirmation(
            'Would you like to delete this course?',
            Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
            Field.YES_DELETE
          )
        }
      })
    })
    cy.get('@cwThreeDots').within(() => {
      this.get3DotsItemName().should(
        'have.ordered.members',
        deletable ? this._courseNoInstance3Dots : this._courseHasInstance3Dots
      )
    })
  }
  verifyCourseExistsInManageCourse() {
    this.defineAliasCourseWrapper()
    cy.get('@courseWrapper').should('be.visible')
  }
  verifyManageCourseEmptyState() {
    cy.contains('p', 'No courses available.').should('be.visible')
  }
  verifyUpdatedCourseWebNotification(userName, courseId) {
    cy.signOut()
    SignInAs.copAdminSecond()
    const node = new Node() //TODO: Problem with web notification in BETA is not yet implement from here to below
    node.escapeStepWithNodeProblem(node.liferayBothNode, node.isBeta(), () => {
      this._itcFetchCourses.set()
      new WebNotification().expectToSeeModifyCourseInfo(userName, this._course['name'])
      this._itcFetchCourses.wait()
    })
    if (node.isBeta()) {
      this.goToCourseOverview(courseId)
    }
  }
  verifyCourseOverview() {
    super._defineAliasMainContent()
    cy.get('@cardMainContent').within(() => {
      super._expectToSeeCourseFee()
      LmsManagementHelper.expectToSeeCourseLabel()
      super._expectToSeeCourseBanner()
      super._expectToSeeCourseOverview()
      super._expectToSeeCourseAttachment()
      super._expectToSeeCourseTagSkill()
    })
    this.verifyTogglePublicCourse()
  }
  verifyEditCourse() {
    super._defineAliasMainContent()
    cy.get('@cardMainContent').within(() => {
      cy.contains('.control-label', 'Course Title')
        .parent()
        .getInput()
        .should('have.value', this._course['name'])
      this.verifyEditCourseBanner()
      cy.contains('.control-label', 'Course Overview')
        .parent()
        .editorBodyContain(this._course['courseOverview'])
      cy.contains('.control-label', 'Course Fee')
        .parent()
        .getInput('number', '0.00')
        .should('have.value', super._getCourseFee(true))
      this.verifyUploadFileDropZone()
      if (this._course['attachment']) {
        super._verifyCourseAttachment()
      }
      if (this._course['tagSkill']) {
        super._verifyCourseTagsAndSkills()
      }
      this.verifySaveCourseButtonDisabled()
    })
    this.verifyRightPanelSaveCourseButton()
  }
  verifySaveCourseButtonDisabled(isCreate) {
    cy.contains('button', !isCreate ? 'Save Course' : 'Save as Draft').should(
      'have.attr',
      'disabled',
      'disabled'
    )
  }
  verifyUploadFileDropZone() {
    cy.contains(
      'Upload File Note: These files will be available for everyone (including pre-booking)'
    ).should('be.visible')
    cy.verifyDropZoneArea('Drop file here to upload or')
  }
  verifyTogglePublicCourse() {
    cy.cecCard().cardRightContent()
    cy.get('@cardRightContent').within(($rightCard) => {
      cy.wrap($rightCard)
        .cecCardHeaderFixHeight()
        .within(($headerRight) => {
          cy.wrap($headerRight).cwToggleButton('Publish course')
        })
    })
  }
  verifyEditCourseBanner() {
    cy.get('.cw-form-image-wrapper').within(() => {
      cy.get('figure.image__wrapper')
        .should('have.class', 'loaded')
        .find('> img.image__item')
        .should('be.visible')
        .and('have.attr', 'src')
      cy.contains('button', 'Change Photo').should('not.be.visible').hidedSvgIcon()
    })
  }
  verifyCourseInstance3DotsAndDeleteConfirm(instanceDate) {
    this.defineAliasCourseWrapper()
    cy.get('@courseWrapper').within(() => {
      cy.cwTable().rowName(instanceDate).as('courseInstance')
    })
    cy.get('@courseInstance').getCwSplitDropdown()
    cy.get('@cwSplitDropdown').within(($cwSplitDropdown) => {
      this.get3DotsItemName().should('have.ordered.members', this._courseInstance3Dots)
      cy.wrap($cwSplitDropdown).clickCwSplitDropdownToggle(Field.DELETE)
    })
    cy.get('@courseInstance').verifySwal2Confirmation(
      'Would you like to delete this instance?',
      Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
      Field.YES_DELETE
    )
  }
  verifyPublishAndUnpublishCourse(isPublish) {
    cy.get('.course-detail-wrapper')
      .cecCard()
      .cardRightContent()
      .within(($rightContent) => cy.wrap($rightContent).cecCardHeader().as('cardHeader'))
    cy.get('@cardHeader').within(($cardHeader) => {
      cy.wrap($cardHeader).cwToggleButton('Publish course')
    })
    cy.get('@button').toggleIsValidState(!isPublish)
    this._itcUpdateCourseStatus.set()
    cy.get('@button').toggleSwitch()
    if (!isPublish) {
      this.confirmUnpublishCourseAndVerify()
    }
    this._itcUpdateCourseStatus.wait()
    const node = new Node() //TODO: issue ref https://khalibre.atlassian.net/browse/CW-10317
    node.escapeStepWithNodeProblem(node.liferayBothNode, node.isBeta(), () => {
      cy.expectToastMessage(
        isPublish ? 'The course has been published.' : 'The course has been unpublished.'
      )
    })
  }
  verifyCourseCardInManageCourse(isDefaultImage = false, filter = Field.CURRENT) {
    this.searchCourseWithFilter(filter)
    this.defineAliasCourseWrapper()
    cy.get('@courseWrapper')
      .parent()
      .within(() => {
        cy.get('img.course-image-thumbnail')
          .should('be.visible')
          .and('have.attr', 'src')
          .and(isDefaultImage ? 'contain' : 'not.contain', '/course-default-image.png')
        cy.contains('a', this.getCourseName()).should('be.visible')
        cy.contains('p', this._course['courseOverview']).should('be.visible')
      })
  }
  verifyCreateCourse() {
    super._defineAliasMainContent()
    this.verifyCreateCourseHeader()
    cy.get('@cardMainContent').within(() => {
      cy.expectElementWithLabelVisible('General Information', 'h1')
      cy.contains('label', 'Course Title').hasSvgIcon()
      cy.getInput('text', 'Enter the title of the course')
        .should('have.attr', 'maxlength', '120')
        .and('be.visible')
        .parent()
        .contains('span', '0/120')
        .should('be.visible')
      this.verifyCreateCourseBanner()
      this.verifyInputCourseOverview()
      this.verifyCourseFee()
      this.verifyNoCoursePaymentElements()
      this.verifyUploadFileDropZone()
      this._course = { tagSkill: this._orgTagsAndSkills }
      super._setCourse(this._course)
      super._verifyCourseTagsAndSkills(false, true)
      this.verifySaveCourseButtonDisabled(true)
    })
    this.verifyRightPanelSaveCourseButton(true)
  }
  verifyCreateCourseOnNormalCop() {
    this.verifyCreateCourse()
    this.verifyCollaborationSetting()
    cy.get('@cardMainContent').within(() => this.verifyNoProviderCategoryAndCourseCompletion())
  }
  verifyCreateNewCoursePopup() {
    cy.get('.cw-top-header').within(($topHeader) => {
      cy.getElementWithLabel(this._createNewCourseLabel, 'button').click()
      cy.wrap($topHeader).swal2().as('popupNewCourse')
    })
    this.verifyCreateNewCoursePopupHeader()
    cy.get('@popupNewCourse')
      .getSwal2Content()
      .within(() => {
        this.verifyNewCourseTypeItem(
          0,
          'New Course',
          'Create a new course from scratch by adding learning materials for your learners.',
          true
        )
        this.verifyNewCourseTypeItem(
          1,
          'Duplicate Course',
          'Get started faster by duplicating existing courses and then customizing it accordingly.'
        )
        this.verifyNewCourseTypeItem(
          2,
          'Add Existing Course',
          'Utilize an existing course from your organization without changing anything.'
        )
      })
    cy.get('@popupNewCourse').closeSwal2()
  }
  verifyCreateNewCoursePopupHeader() {
    cy.get('@popupNewCourse').getSwal2Header().should('contain.text', this._createNewCourseLabel)
  }
  verifyNewCourseTypeItem(index, title, description, selected) {
    cy.get('.text-noselect').eq(index).as('newCoursePopupOption')
    cy.get('@newCoursePopupOption').within(($item) => {
      if (selected) {
        cy.wrap($item).should('have.class', 'selected').hasSvgIcon()
      }
      cy.get('div:first').hasSvgIcon()
      cy.contains('div.font-weight-bold', title).should('be.visible')
      cy.contains('div', description).should('be.visible')
    })
    if (title.includes('Duplicate Course')) {
      this.verifyDuplicateOrExistingCourse(true)
    } else if (title.includes('Add Existing Course')) {
      this.verifyDuplicateOrExistingCourse()
    }
  }
  verifyDuplicateOrExistingCourse(isDuplicateCourse) {
    cy.get('@newCoursePopupOption').click()
    this._itcFetchAdminSharedCourseOption.set()
    this._itcSearchAdminSharedCourse.set()
    cy.contains('button', Field.NEXT).click()
    this._itcFetchAdminSharedCourseOption.wait()
    this._itcSearchAdminSharedCourse.wait()
    this.verifyInputSearchBox()
    this.verifyDropDownSharedCourses()
    this.verifyListShareableCourses()
    cy.contains('a[role="button"]', 'Back').as('backButton')
    cy.get('@backButton').hasSvgIcon()
    cy.contains('button', isDuplicateCourse ? Field.DUPLICATE : Field.ADD).should(
      'have.attr',
      'disabled',
      'disabled'
    )
    cy.get('@backButton').click()
  }
  verifyListShareableCourses() {
    cy.get('.list-course-wrapper > .text-noselect').should('have.length', 5)
  }
  verifyDropDownSharedCourses() {
    cy.wrap(null).then(() => {
      this._itcFetchAdminSharedCourseOption
        .getResponse()
        .its('response.body.result')
        .then((result) => {
          cy.getCwDropdown().within(($dropdown) => {
            cy.wrap($dropdown).getDropdownToggle().should('contain.text', result[0].value)
            this.get3DotsItemName().should(
              'have.ordered.members',
              result.map((o) => o.value)
            )
          })
        })
    })
  }
  verifyInputSearchBox() {
    cy.getInput('text', 'Search')
      .should('be.visible')
      .parent()
      .within(() => {
        cy.get('span.glyphicon').should('have.class', 'glyphicon-search')
        cy.contains('a.btn-clear-search', 'Clear').should('have.class', 'd-none')
      })
  }
  verifyCreateCourseOnUnderOrgCop() {
    this.verifyCreateCourse()
    this.verifyCollaborationSetting()
    this.verifyCourseCompletion()
  }
  verifyInputCourseOverview() {
    cy.getElementWithLabel('Course Overview', 'label').as('courseOverview')
    cy.get('@courseOverview').should('be.visible').find('span.reference-mark').hasSvgIcon()
    cy.get('@courseOverview').parent().hasTextEditor().verifyEditorToolBar(true)
  }
  verifyRightPanelSaveCourseButton(isCreate) {
    cy.get('@cecCard')
      .cardRightContent()
      .cecCardHeader()
      .then(() => {
        this.verifySaveCourseButtonDisabled(isCreate)
      })
  }
  verifyNoCoursePaymentElements() {
    cy.expectElementWithLabelNotExist('Payment Method', 'label')
    cy.expectElementWithLabelNotExist('Category', 'label')
    cy.expectElementWithLabelNotExist('Account', 'label')
    cy.expectElementWithLabelNotExist('Account Code', 'label')
    cy.expectElementWithLabelNotExist('Second Account', 'label')
  }
  verifyCreateCourseHeader() {
    cy.get('@cardMainContent')
      .cecCardHeader()
      .then(() => {
        cy.hasSvgIcon()
        cy.get('.cec-card__title').should('contain.text', this._createNewCourseLabel)
      })
  }
  verifyNoProviderCategoryAndCourseCompletion() {
    cy.expectElementWithLabelNotExist('Categories', 'label')
    cy.expectElementWithLabelNotExist('Select Categories', 'button')
    cy.expectElementWithLabelNotExist('Providers', 'label')
    cy.expectElementWithLabelNotExist('Select Providers', 'button')
    cy.expectElementWithLabelNotExist('Course Completion', 'div')
  }

  #expectCollaborationConnect() {
    const onlyLearnerItem = 'Only learners within the same course instance'
    cy.getElementWithLabel('Enable Connect', '.d-flex')
      .first()
      .within(($connect) => {
        cy.wrap($connect).cwToggleButton().toggleIsEnable()
        cy.getElementWithLabel(
          'Connect is a directory for learners that enables them to engage with others who are taking this course.',
          'span'
        )
        cy.getElementWithLabel('Who learners can see', 'label')
        cy.expectDropdownToggleValue(onlyLearnerItem)
        cy.getDropdownList()
          .should('contain.text', onlyLearnerItem)
          .and('contain.text', 'All learners in this course')
      })
  }
  #expectCollaborationDiscussion() {
    cy.getElementWithLabel('Enable Discussion', '.d-flex')
      .first()
      .within(($discussion) => {
        cy.wrap($discussion).cwToggleButton().toggleIsEnable()
        cy.getElementWithLabel(
          'Provide a forum for learners and facilitators to post and have conversations.',
          'span'
        )
      })
  }

  verifyCollaborationSetting() {
    cy.getElementWithLabel('Collaboration Settings', '.border-bottom').within(() => {
      cy.getElementWithLabel('Collaboration Settings', 'h1')
      this.#expectCollaborationConnect()
      this.#expectCollaborationDiscussion()
    })
  }

  verifyCourseCompletion() {
    const node = new Node() //TODO: the feature not yet deploy to BETA yet
    node.escapeStepWithNodeProblem(node.liferayBothNode, node.isBeta(), () => {
      cy.get('@cardMainContent').within(() => {
        cy.contains('div', 'Course Completion')
          .should('be.visible')
          .parent()
          .within(($courseCompletion) => {
            cy.wrap($courseCompletion)
              .cwToggleButton('Award learners with a certificate')
              .toggleIsValidState(false)
            cy.wrap($courseCompletion).find('> div:last').as('allowAddingToProfile')
          })
        cy.get('@allowAddingToProfile').within(($allowAddingToProfile) => {
          cy.wrap($allowAddingToProfile)
            .cwToggleButton('Allow adding to profile')
            .toggleIsValidState(true)
          cy.get('@button').find('> label > span').should('have.class', 'disabled')
        })
      })
    })
  }
  verifyCourseFee() {
    cy.getElementWithLabel('Course Fee', 'label')
      .parent()
      .within(($courseFee) => {
        cy.get('.input-group-prepend').as('currency')
        cy.wrap($courseFee).getInput('number', '0.00').should('be.visible')
        cy.contains('.text-danger', 'Invalid course fee').should('not.be.visible')
      })
    cy.get('@currency').contains('button', 'USD').hasSvgIcon()
    cy.get('@currency').contains('.dropdown-menu > a', 'USD').should('not.be.visible')
  }
  verifyCreateCourseBanner() {
    cy.get('.image-upload-container')
      .should('have.class', 'border')
      .and('have.class', 'border-style-dash')
      .find('div')
      .within(() => {
        cy.hasSvgIcon()
        cy.contains('button', 'Add a Course Image').should('have.class', 'btn-outline-primary')
        cy.get('em').should('contain.text', 'Recommended banner size:  930 x 400px')
      })
  }
  confirmUnpublishCourseAndVerify() {
    cy.get('@cardHeader')
      .swal2()
      .within(($popup) => {
        cy.wrap($popup)
          .getSwal2Header()
          .should('contain', 'Would you like to unpublish this course?')
        cy.wrap($popup)
          .getSwal2Content()
          .should(
            'contain',
            'Learners cannot purchase or enroll this course. For learners that already enrolled, they can still continue the course.'
          )
        cy.wrap($popup).swal2Cancel(Field.REMAIN_PUBLISHED)
        cy.wrap($popup).swal2Confirm(Field.YES_UN_PUBLISH).click()
      })
  }
  expectToSeePageNotFound() {
    cy.pageNotFound()
  }
  expectStayOnEditCoursePage(courseId) {
    cy.expectUrlInclude(this.getCourseUrl(courseId, 'edit-course'))
  }
  viewAllInstances() {
    this._itcFetchCourse.set()
    this.clickOnInstanceFilterBy(Field.ALL)
    this._itcFetchCourse.wait()
    cy.waitLoadingOverlayNotExist()
  }
  clickOnInstanceFilterBy(filter) {
    cy.get('.btn-group-filter-course')
      .find('.cw-learning-dropdown__wrapper')
      .within(($dropdown) => {
        cy.wrap($dropdown).click()
        cy.wrap($dropdown).clickDropdownName(filter)
      })
  }
  verifyArchieveInstance(courseName, instanceDate) {
    this.getCourseInstancesBy(courseName, instanceDate).then(($instance) => {
      cy.wrap($instance).should('be.visible').and('have.class', 'text-gray')
      cy.wrap($instance).within(($ci) => {
        cy.wrap($ci)
          .getThreeDots()
          .within(($threeDots) => {
            cy.wrap($threeDots).click()
            cy.getDropdownList().should('have.length', 3)
            this.get3DotsItemName().should('have.ordered.members', [
              Field.OVERVIEW,
              Field.UN_ARCHIVE,
              Field.DELETE,
            ])
          })
        cy.wrap($ci).clickDropdownName(Field.DELETE)
        cy.wrap($ci).verifySwal2Confirmation(
          'Would you like to delete this instance?',
          Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
          Field.YES_DELETE,
          Field.CANCEL
        )
        cy.wrap($ci).getThreeDots().click()
        cy.wrap($ci).clickDropdownName(Field.UN_ARCHIVE)
        cy.wrap($ci).verifySwal2Confirmation(
          'Unarchive this course instance?',
          '',
          Field.YES_UN_ARCHIVE,
          Field.CANCEL
        )
      })
    })
  }
  verifyNotArchiveInstance(courseName, instanceDate) {
    this.getCourseInstancesBy(courseName, instanceDate).then(($instance) => {
      cy.wrap($instance).should('be.visible')
      cy.wrap($instance).within(($ci) => {
        cy.wrap($ci)
          .getThreeDots()
          .within(($threeDots) => {
            cy.wrap($threeDots).click()
            cy.getDropdownList().should('have.length', 8)
            this.get3DotsItemName().should('have.ordered.members', [
              Field.VIEW,
              Field.EDIT,
              Field.DUPLICATE,
              Field.ARCHIVE,
              'Training Reports',
              'Learner Resources',
              'People',
              'View Discussion',
            ])
            cy.wrap($ci).clickDropdownName(Field.ARCHIVE)
            cy.wrap($ci).verifySwal2Confirmation(
              'Archive this course instance?',
              'Learners who have already booked this instance will still be able to access it and continue their learning.',
              Field.YES_ARCHIVE,
              Field.CANCEL
            )
          })
      })
    })
  }
  getCourseInstancesBy(courseName, instanceDate) {
    cy.get('.position-relative .border-bottom-style-dash')
      .find(`p.font-weight-bold:contains("${courseName}")`)
      .next()
      .next()
      .within(($courseInstanceList) => {
        return cy
          .wrap($courseInstanceList)
          .find(`tr.cursor-pointer:contains("${instanceDate}")`)
          .as('instance')
      })
    return cy.get('@instance')
  }
  clickOnOverviewTab() {
    this._itcFetchCourses.set()
    this._itcCourseProperties.set()
    this.clickOnTab(Field.OVERVIEW)
    this._itcFetchCourses.wait()
    this._itcCourseProperties.wait()
  }
  clickOnTab(tab) {
    cy.cecCard().cardRightContent().find(`a:contains("${tab}")`).click()
  }
  clickOnEditTab() {
    this._itcRenderCopAdmin.set()
    this._itcFetchCourses.set()
    this.clickOnTab('Edit Course')
    this._itcRenderCopAdmin.wait()
    this._itcFetchCourses.wait()
  }
  expectToSeeConfirmLeavePromptPopup() {
    cy.swal2().verifySwal2Confirmation(
      'Do you want to leave this page?',
      'You have unsaved changes.',
      'Leave this page',
      'Stay on this page'
    )
  }
  expectStayOnTab(tab) {
    cy.cecCard()
      .cardRightContent()
      .get(`.nav > a:contains("${tab}")`)
      .should('be.visible')
      .and('have.class', 'active')
  }
  expectNotStayOnTab(tab) {
    cy.cecCard()
      .cardRightContent()
      .get(`.nav > a:contains("${tab}")`)
      .should('be.visible')
      .and('not.have.class', 'active')
  }
  backToManageCourses() {
    this._itcFetchCourse.set()
    cy.clickBackLink()
    this._itcFetchCourse.wait()
  }
  rowListCourseInstance() {
    cy.get(`p:contains("${this._course.name}")`)
      .next()
      .next()
      .find('table > tbody > tr')
      .as('listCourseInstance')
  }
  expectNotToSeeInstanceByDate(date = '-') {
    this.rowListCourseInstance()
    cy.get('@listCourseInstance').each(($row) => {
      this.expectValue($row, date, 'not.contain')
    })
  }

  expectToSeeInstanceByDate(date = '-') {
    this.rowListCourseInstance()
    cy.get('@listCourseInstance').should('contain.text', date)
  }

  expectToSeeInstanceByStatus(status = '') {
    this.rowListCourseInstance()
    cy.get('@listCourseInstance').each(($row) => {
      this.expectValue($row, status)
    })
  }

  expectToContainsValue(subject, value = '-') {
    cy.wrap(subject)
      .contains('td:first', value == '-' ? /^-/ : value)
      .parents('tr')
      .should('be.visible')
  }

  expectValue(subject, value = '-', condition = 'contain') {
    cy.wrap(subject).should(condition, value)
  }
}

export default CopManageCourse
