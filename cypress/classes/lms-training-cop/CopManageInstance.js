import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import QuickTip from '../utilities/QuickTip'
import YamlHelper from '../utilities/YamlHelper'

class CopManageInstance {
  _copAdminUrl
  _course
  _instance

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
  _itcFetchCourseInstance = new InterceptReq(
    '/manage_courses/course_instance/fetch',
    'FetchCourseInstance'
  )
  _itcFetchCourseInstances = new InterceptReq(
    '/manage_courses/fetch_course_instances',
    'fetchCourseInstances'
  )
  _itcPublish = new InterceptReq('/manage_courses/course_instance/publish', 'publish')
  _itcFetchNotes = new InterceptReq('/course_instance_note/get', 'fetchNote')
  _itcFetchUsers = new InterceptReq('/course_instance/fetch_users', 'fetchUsers')
  _itcUpdateInstance = new InterceptReq('/manage_courses/course_instance/modify', 'updateInstance')
  _itcArchiveInstance = new InterceptReq('/manage_courses/archive_instance', 'archiveInstance')
  _itcDeleteInstance = new InterceptReq('/manage_courses/delete_instance', 'deleteInstance')
  _itcDuplicateInstance = new InterceptReq(
    '/manage_courses/duplicate_instance',
    'duplicateInstance'
  )

  #copLearningAdminUserIndexIdentity = 1
  #activeInstancesIndex = 0
  #archiveInstancesIndex = 1
  #invokeContentTitleIndex = 1
  #invokeContentDateIndex = 2

  constructor(copAdminUrl) {
    this._copAdminUrl = copAdminUrl
  }

  setCourseAndInstance(course, instance) {
    this._course = course
    this.setInstance(instance)
  }

  setInstance(instance) {
    this._instance = instance
  }

  getCourse() {
    return this._course
  }
  getInstance() {
    return this._instance
  }
  getInstanceUrl(courseId, instanceId, tab = 'overview') {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${instanceId}&_copMemberManagementPortlet_tab=${tab}&_copMemberManagementPortlet_courseId=${courseId}`
  }
  getEditInstanceUrl(courseId, instanceId) {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${instanceId}&_copMemberManagementPortlet_tab=edit-course-instance&_copMemberManagementPortlet_courseId=${courseId}`
  }
  getCourseInstanceUrl(courseId) {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=course-instances`
  }
  getEditInstanceUrl(courseId, instanceId) {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${instanceId}&_copMemberManagementPortlet_tab=edit-course-instance&_copMemberManagementPortlet_courseId=${courseId}`
  }
  getCreateInstanceUrl(courseId) {
    return `?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_id=0&_copMemberManagementPortlet_tab=edit-course-instance&_copMemberManagementPortlet_courseId=${courseId}&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit`
  }
  goToInstanceOverview(courseId, instanceId) {
    this._itcFetchCourses.set()
    this._itcCourseInstanceOverview.set()
    this._itcFetchCourseActivities.set()
    cy.visit(`${this._copAdminUrl}${this.getInstanceUrl(courseId, instanceId)}`, {
      failOnStatusCode: false,
    })
    this._itcFetchCourses.wait()
    this._itcCourseInstanceOverview.wait()
    this._itcFetchCourseActivities.wait()
    Cypress.on('uncaught:exception', () => false)
  }
  goToCourseInstances(courseId) {
    this._itcFetchCourseInstances.set()
    cy.visit(`${this._copAdminUrl}${this.getCourseInstanceUrl(courseId)}`, {
      failOnStatusCode: false,
    })
    cy.wait(1000)
    this._itcFetchCourseInstances.wait()
    cy.waitLoadingOverlayNotExist()
    cy.wait(1000)
    Cypress.on('uncaught:exception', () => false)
  }
  goToEditInstance(courseId, instanceId) {
    this._itcFetchCourses.set()
    this._itcCourseInstanceOptions.set()
    this._itcAdminGetMembers.set()
    this._itcFetchCourseInstance.set()
    cy.visit(
      `${this._copAdminUrl}${this.getInstanceUrl(courseId, instanceId, 'edit-course-instance')}`,
      { failOnStatusCode: false }
    )
    this._itcFetchCourses.wait()
    this._itcCourseInstanceOptions.wait()
    this._itcAdminGetMembers.wait()
    this._itcFetchCourseInstance.wait()
    Cypress.on('uncaught:exception', () => false)
  }
  goToInstanceCourseActivity(courseId, instanceId) {
    this._itcFetchCourses.set()
    this._itcFetchCourseActivities.set()
    cy.visit(`${this._copAdminUrl}${this.getInstanceUrl(courseId, instanceId, 'activities')}`, {
      failOnStatusCode: false,
    })
    this._itcFetchCourses.wait()
    this._itcFetchCourseActivities.wait()
    Cypress.on('uncaught:exception', () => false)
  }
  goToCreateInstance(courseId) {
    this._itcCourseInstanceOptions.set()
    cy.visit(`${this._copAdminUrl}${this.getCreateInstanceUrl(courseId)}`, {
      failOnStatusCode: false,
    })
    this._itcCourseInstanceOptions.wait()
    Cypress.on('uncaught:exception', () => false)
  }
  get3DotsItemName() {
    const itemNames = []
    return cy
      .getDropdownList()
      .each(($el) => itemNames.push($el.text().replace(/\s+/g, ' ').trim()))
      .then(() => cy.wrap(itemNames))
  }
  getInstanceFee(edit) {
    if (edit) return this._instance['courseFee']['value']
    const courseFee = this._instance['courseFee']['value']
    return courseFee > 0 ? 'USD ' + courseFee : 'Free'
  }
  getInstanceDuration(edit) {
    if (edit) return this._instance['expectedDuration']
    const duration = this._instance['expectedDuration']
    return duration + (duration > 0 ? ' Minutes' : ' minute')
  }
  getInstanceEndDate() {
    return this._instance['endDate']
  }
  getInstanceLanguage(display) {
    return display ? this._instance['language'].split(' ')[0] : this._instance['language']
  }
  getInstanceTimezone(display) {
    return display
      ? this._instance['timeZone'].split(' ')[0].slice(0, -1)
      : this._instance['timeZone']
  }
  verifyInstanceOverview(emptyState) {
    cy.get('.course-instance-body-wrapper').within(() => {
      this.verifyInstanceProperties()
      cy.contains(this._course['courseOverview']).should('be.visible')
      cy.contains(this._instance['additionalBookingNote']).should('be.visible')
      cy.contains(this._instance['contactEmail']).should('be.visible')
      cy.contains(this._course['attachment']).hasSvgIcon()
      if (this._course['tagSkill']) {
        cy.contains('Tags & Skills covered in this course:').should('be.visible')
        cy.contains(this._course['tagSkill']).should('have.class', 'border')
      }
      if (emptyState) {
        this.verifyInstanceOverviewEmptyState()
      }
      cy.cecCard()
        .cardRightContent()
        .cecCardHeaderFixHeight()
        .within(($headerRight) => {
          cy.wrap($headerRight).cwToggleButton('Publish course instance')
        })
    })
  }
  verifyInstanceProperties() {
    cy.contains(`Duration: ${this.getInstanceDuration()}`).should('be.visible')
    cy.contains('Course date:')
      .parent()
      .contains(`- ${this.getInstanceEndDate()}`)
      .should('be.visible')
      .parent()
      .contains(`Times are displayed in your time zone ${this.getInstanceTimezone(true)}`)
      .should('not.be.visible')
    cy.contains(`Delivery Methods: ${this._instance['deliveryMethod']}`).should('be.visible')
    cy.contains(`Language: ${this.getInstanceLanguage(true)}`).should('be.visible')
  }
  verifyInstanceOverviewEmptyState() {
    cy.contains('No course activity added yet.').should('be.visible')
    cy.contains('Go to course activity').should('have.class', 'text-uppercase')
  }
  verifyEditInstance() {
    this.getInstanceHolder().within(() => {
      cy.contains('Edit Instance').should('be.visible')
      cy.contains('Delivery Method').should('be.visible')
    })
  }
  verifyStartTimeAndEndTime() {
    cy.getElementByLabel(Field.START_DATE)
      .parent()
      .next()
      .find('input')
      .should('have.value', this._instance.startTime)
    cy.getElementByLabel(Field.END_DATE)
      .parent()
      .next()
      .find('input')
      .should('have.value', this._instance.endTime)
  }
  getInstanceHolder() {
    return cy.get('.edit-instance-holder')
  }
  clickOnBackIcon() {
    this._itcFetchCourseInstances.set()
    cy.clickBackLink()
    cy.wait(3000)
    this._itcFetchCourseInstances.wait()
  }
  clickOnCreateNewInstance() {
    this._itcCourseInstanceOptions.set()
    cy.cecCard().cardRightContent().find('button').contains(Field.CREATE_A_NEW_INSTANCE).click()
    this._itcCourseInstanceOptions.wait()
  }
  expectDeliveryMethodSelected(deliveryMethod) {
    this.getDeliveryMethod(deliveryMethod).should('have.class', 'selected')
  }
  getDeliveryMethod(deliveryMethod) {
    return this.getInstanceHolder()
      .find('label:contains("Choose Delivery Methods")')
      .next()
      .get(`.delivery-method:contains("${deliveryMethod}")`)
  }

  #expectCollaborationConnectAllLearners() {
    const allLearnersItem = 'All learners in this course'
    cy.getElementWithLabel('Enable Connect', '.d-flex')
      .first()
      .within(($connect) => {
        cy.wrap($connect).cwToggleButton().toggleIsEnable()
        cy.getElementWithLabel(
          'Connect is a directory for learners that enables them to engage with others who are taking this course.',
          'span'
        )
        cy.getElementWithLabel('Who learners can see', 'label')
        cy.expectDropdownToggleValue(allLearnersItem)
        cy.getDropdownList()
          .should('contain.text', allLearnersItem)
          .and('contain.text', 'Only learners within this course instance')
      })
  }
  #expectCollaborationConnectOnlyLearners() {
    const onlyLearnersItem = 'Only learners within this course instance'
    cy.getElementWithLabel('Enable Connect', '.d-flex')
      .first()
      .within(($connect) => {
        cy.wrap($connect).cwToggleButton().toggleIsEnable()
        cy.getElementWithLabel(
          'Connect is a directory for learners that enables them to engage with others who are taking this course.',
          'span'
        )
        cy.getElementWithLabel('Who learners can see', 'label')
        cy.expectDropdownToggleDisable(onlyLearnersItem)
        cy.getDropdownList()
          .should('contain.text', onlyLearnersItem)
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
  #verifyCollaborationSettingCourseInstance() {
    cy.getElementWithLabel('Collaboration Settings', '.border-bottom').within(() => {
      cy.getElementWithLabel('Collaboration Settings', 'h1')
      this.#expectCollaborationConnectOnlyLearners()
      this.#expectCollaborationDiscussion()
    })
  }
  verifySelfStudyDeliveryMethodFields() {
    cy.getElementByLabel('Language')
      .find('span:contains("English (United States)")')
      .should('be.visible')
    cy.getElementByLabel('Course Completion (days)').expectInputTypeNumber().and('have.value', '0')
    cy.getElementByLabel('Expected Duration (minutes)')
      .expectInputTypeNumber()
      .and('have.value', '0')
    cy.getElementByLabel('Course Contact Email')
      .should('have.attr', 'placeholder', 'Course Contact Email')
      .and('have.value', '')
    cy.getElementByLabel('Additional Booking Note')
      .should('have.attr', 'placeholder', 'Enter booking notes...')
      .and('have.value', '')
    this.getInstanceHolder()
      .find('em')
      .should(
        'contain.text',
        'Note: This fee will be used instead of the price you set on the course level.'
      )
    cy.getElementByLabel('Course Fee').find('input').expectInputTypeNumber().and('have.value', '2')
    cy.cecCard()
      .cardMainContent()
      .within(($mainContent) => {
        cy.wrap($mainContent)
          .find('button:contains("Cancel")')
          .should('be.visible')
          .and('have.class', 'btn-default')
        cy.wrap($mainContent)
          .find('button:contains("Save Instance")')
          .should('be.visible')
          .and('have.class', 'btn-primary')
      })
    this.getSaveInstanceButton().should('not.have.attr', 'disabled')
    this.#verifyCollaborationSettingCourseInstance()
  }
  verifyDeliveryMethodFields() {
    this.verifySelfStudyDeliveryMethodFields()
    cy.getElementByLabel('Time Zone').should('have.value', 'Asia/Phnom_Penh')
    cy.getElementByLabel(Field.START_DATE).expectToSeeDateTimePicker()
    cy.getElementByLabel(Field.END_DATE).expectToSeeDateTimePicker()
    cy.getElementByLabel('Maximum Number of Participants')
      .expectInputTypeNumber()
      .and('have.value', '1')
    cy.getElementByLabel('Must Book by').expectInputTypeNumber().and('have.value', 0)
    cy.getElementByLabel('Must Cancel by').expectInputTypeNumber().and('have.value', '0')
  }
  selectDeliveryMethodAndVerifyFields(deliveryMethod) {
    this.getDeliveryMethod(deliveryMethod).click()
    this.expectDeliveryMethodSelected(deliveryMethod)
    this.verifyDeliveryMethodFields()
    this.#verifyCollaborationSettingCourseInstance()
  }
  verifyLeaveThisPagePopup() {
    cy.clickBackLink()
    cy.get('.swal2-popup')
      .within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup)
          .find('.swal2-title')
          .should('contain.text', 'Do you want to leave this page?')
        cy.wrap($popup).find('.swal2-content').should('contain.text', 'You have unsaved changes.')
        cy.wrap($popup)
          .find('.swal2-actions > button:contains("Stay on this page")')
          .should('be.visible')
          .and('have.class', 'btn-outline-primary')
        cy.wrap($popup)
          .find('.swal2-actions > button:contains("Leave this page")')
          .should('be.visible')
          .and('have.class', 'btn-primary')
      })
      .closeSwal2()
  }
  verifyConfirmPublishPopup(hasActivity = true) {
    this._itcPublish.set()
    this.clickOnPublishCourseInstance()
    if (!hasActivity) {
      cy.swal2()
        .getSwal2Header()
        .should('contain.text', 'You haven')
        .verifySwal2Confirmation(
          't added any course activities. Are you sure you want to publish?',
          '',
          Field.PUBLISH,
          'Keep Unpublished'
        )
      this.clickOnPublishCourseInstance()
      cy.swal2Confirm(Field.PUBLISH).click()
    }
    this._itcPublish.wait()
  }
  verifyConfirmUnpublishPopup() {
    this._itcPublish.set()
    this.clickOnPublishCourseInstance()
    cy.swal2().verifySwal2Confirmation(
      'Would you like to unpublish this course instance?',
      '',
      Field.YES_UN_PUBLISH,
      Field.REMAIN_PUBLISHED
    )
    this.clickOnPublishCourseInstance()
    cy.swal2Confirm(Field.YES_UN_PUBLISH).click()
    this._itcPublish.wait()
  }
  clickOnPublishCourseInstance() {
    this.getRightContentHeader().find('.slider').click()
  }
  getRightContentHeader() {
    return cy.get('.cec-card__right-content > .cec-card__header')
  }
  clickOnInstanceOverviewTab() {
    this._itcFetchCourseActivities.set()
    this.clickOnTab('Instance Overview')
    this._itcFetchCourseActivities.wait()
  }
  clickOnInstanceCourseActivityTab() {
    this._itcFetchCourseActivities.set()
    this.clickOnTab('Course Activities')
    this._itcFetchCourseActivities.wait()
  }
  clickOnEditInstanceTab() {
    this._itcFetchCourseInstance.set()
    this.clickOnTab('Edit Instance')
    this._itcFetchCourseInstance.wait()
  }
  clickOnTab(tab) {
    cy.cecCard().cardRightContent().find(`a:contains("${tab}")`).click()
  }
  expectNoPromptPopup() {
    cy.swal2().should('not.exist')
  }
  editInstance() {
    cy.inputByLabel('Course Completion (days)', this._instance.courseCompletion)
    cy.inputByLabel('Expected Duration (minutes)', this._instance.expectedDuration)
    cy.getElementByLabel('Time Zone').select(this._instance.timeZone)
    this.enterDateAndTime(this._instance.startDate, this._instance.startTime, Field.START_DATE)
    this.enterDateAndTime(this._instance.endDate, this._instance.endTime, Field.END_DATE)
    cy.inputByLabel('Maximum Number of Participants', this._instance.maxParticipant)
    cy.inputByLabel('Must Book by', this._instance.mustBookBy)
    cy.inputByLabel('Must Cancel by', this._instance.mustCancelBy)
    cy.inputByLabel('Course Contact Email', this._instance.contactEmail)
    cy.inputByLabel('Additional Booking Note', this._instance.additionalBookingNote)
    cy.inputFormGroup('Course Fee', this._instance.courseFee.value)
  }
  enterDateAndTime(date, time, dateLabel) {
    cy.getElementByLabel(dateLabel)
      .find('input')
      .clear()
      .type(date)
      .parents('div.cec-pr-1')
      .next()
      .find('input')
      .clear({ force: true })
      .type(time)
  }
  verifyPromptPopup() {
    this.clickOnTab('Instance Overview')
    cy.swal2().verifySwal2Confirmation(
      'Do you want to leave this page?',
      'You have unsaved changes.',
      'Leave this page',
      'Stay on this page'
    )
  }
  verifyStayOnThisPage() {
    this.clickOnTab('Instance Overview')
    cy.swal2().swal2Cancel('Stay on this page').click()
    this.getInstanceHolder().should('be.visible')
  }
  verifyLeaveThisPage() {
    this.clickOnTab('Instance Overview')
    cy.swal2().swal2Confirm('Leave this page').click()
    this.getInstanceHolder().should('not.exist')
  }
  addFacilitator() {
    this.#readUserData((userName, screenName) => {
      this._itcFetchUsers.set()
      this.getInstanceHolder().getElementWithLabel('Add Facilitator', 'a').click()
      this._itcFetchUsers.wait()
      cy.getPopup().within(($popup) => {
        cy.wrap($popup).inputSearch().clear().type(screenName)
        cy.wait(300)
        this._itcFetchUsers.wait()
        cy.wrap($popup).getElementWithLabel(userName, 'label').click()
        cy.wrap($popup).clickButtonByName(Field.ADD)
      })
    }, this.#copLearningAdminUserIndexIdentity)
  }
  removeFacilitator() {
    this.#readUserData((userName) => {
      cy.getElementByLabel('Facilitators')
        .as('facilitators')
        .invoke('text')
        .then(($text) => {
          if ($text.includes(userName)) {
            cy.get('@facilitators').getElementWithLabel(userName, 'span').next().click()
          }
        })
    }, this.#copLearningAdminUserIndexIdentity)
  }
  clickOnSaveInstance() {
    this._itcUpdateInstance.set()
    this.getSaveInstanceButton().click()
    this._itcUpdateInstance.wait()
  }
  getSaveInstanceButton() {
    return this.getRightContentHeader().find('button:contains("Save Instance")')
  }
  addLanguage() {
    cy.getElementByLabel('Language').within(($language) => {
      cy.wrap($language).click()
      cy.inputByPlaceholder('Search', this._instance.language)
      cy.get(`.option:contains('${this._instance.language}')`).find('input').check()
    })
  }
  removeLanguage() {
    cy.getElementByLabel('Language').within(($language) => {
      cy.wrap($language).click()
      cy.inputByPlaceholder('Search', this._instance.removeLanguage)
      cy.get(`.option:contains('${this._instance.removeLanguage}')`).find('input').uncheck()
    })
  }
  expectToSeeInstanceByDate() {
    this.#getFirstActiveInstanceByDate(this._instance.date).then(($instance) => {
      if ($instance !== undefined) {
        cy.wrap($instance).should('be.visible')
      }
    })
  }
  archiveInstancesByDate() {
    this.archiveInstancesBy(this._instance.date)
  }
  deleteArchiveInstancesByDate() {
    this.deleteArchiveInstancesBy(this._instance.date)
  }
  clickOnNotesTab() {
    this._itcFetchNotes.set()
    this.clickOnTab('Notes')
    this._itcFetchNotes.wait()
  }

  duplicateInstance(duplicatedInstance) {
    this.duplicateInstanceByDate(duplicatedInstance.date).then((success) => {
      if (success) {
        this.#editDuplicateInstance(duplicatedInstance)
      }
    })
  }

  duplicateInstanceByDate(instanceDate) {
    cy.wrap(false).as('successDuplicate')
    this.#getFirstActiveInstanceByDate(instanceDate).then(($wrapper) => {
      if ($wrapper !== undefined) {
        cy.wrap($wrapper).within(($instance) => {
          this._itcDuplicateInstance.set()
          this._itcFetchCourseInstance.set()
          this.#clickOnDropdownOption($instance, Field.DUPLICATE)
          this._itcDuplicateInstance.wait()
          this._itcFetchCourseInstance.wait()
          cy.wrap(true).as('successDuplicate')
        })
      }
    })
    return cy.get('@successDuplicate')
  }

  archiveAllInstancesBy(instanceDate) {
    this.#getActiveInstancesByDate(instanceDate).then(($instances) => {
      if ($instances.length) {
        cy.wrap($instances).each(() => {
          this.#archiveInstanceBy(instanceDate)
        })
      }
    })
  }

  deleteAllArchiveInstancesBy(instanceDate) {
    this.#expandArchived()
    this.#getArchiveInstancesByDate(instanceDate).then(($archiveInstances) => {
      if ($archiveInstances.length) {
        cy.wrap($archiveInstances).each(() => {
          this.#deleteArchiveInstanceBy(instanceDate)
          this.#expandArchived()
        })
      }
    })
  }

  archiveInstancesBy(instanceDate) {
    this.#getActiveInstancesByDate(instanceDate).then(($instances) => {
      if ($instances.length) {
        cy.wrap($instances).each(($instance, $index) => {
          if ($index !== 0) {
            // Prevent archive last instance
            this.#archiveInstanceBy(instanceDate)
          }
        })
      }
    })
  }

  deleteArchiveInstancesBy(instanceDate) {
    this.#expandArchived()
    this.#getArchiveInstancesByDate(instanceDate).then(($archiveInstances) => {
      if ($archiveInstances.length) {
        cy.wrap($archiveInstances).each(($archiveInstance, $index) => {
          if ($index !== 0) {
            // Prevent delete last archive instance
            this.#deleteArchiveInstanceBy(instanceDate)
            this.#expandArchived()
          }
        })
      }
    })
  }

  deleteArchiveInstancesByTitle(instanceTitle) {
    this.#expandArchived()
    this.#deleteInstancesByTitle(instanceTitle)
  }

  clickOnBackLink() {
    this._itcFetchCourseInstances.set()
    cy.clickBackLink()
    this._itcFetchCourseInstances.wait()
  }

  publishCourseInstance() {
    this._itcPublish.set()
    this.clickOnPublishCourseInstance()
    this._itcPublish.wait()
  }

  #editDuplicateInstance(duplicatedInstance = {}) {
    this.enterDateAndTime(
      duplicatedInstance.startDate,
      duplicatedInstance.startTime,
      Field.START_DATE
    )
    this.enterDateAndTime(duplicatedInstance.endDate, duplicatedInstance.endTime, Field.END_DATE)
    /* TODO: input course instance title before save
      // implement input course title
    */
    this.clickOnSaveInstance()
    this.clickOnInstanceOverviewTab()
    this.publishCourseInstance()
    this.clickOnBackLink()
  }

  #readUserData(callback = () => {}, index = 0) {
    new YamlHelper('users')
      .read()
      .its(this._instance.facilitators)
      .then((result) => {
        const user = result.users[new Environment().getEnvYaml()]
        const screenName = user.screenNames[index]
        const fullName = user.fullNames[index]
        cy.getCurrentLoginUserScreenName().then(($currentUserScreenName) => {
          const userName = $currentUserScreenName === screenName ? fullName : screenName
          callback(userName, screenName)
        })
      })
  }

  #getFirstActiveInstanceByDate(instanceDate) {
    cy.wrap(undefined).as('firstInstance')
    this.#getActiveInstancesByDate(instanceDate).then(($instances) => {
      if ($instances.length) {
        cy.wrap($instances[0]).as('firstInstance')
      }
    })
    return cy.get('@firstInstance')
  }

  #getFirstArchiveInstanceByDate(instanceDate) {
    cy.wrap(undefined).as('firstArchiveInstance')
    this.#getArchiveInstancesByDate(instanceDate).then(($archiveInstances) => {
      if ($archiveInstances.length) {
        cy.wrap($archiveInstances[0]).as('firstArchiveInstance')
      }
    })
    return cy.get('@firstArchiveInstance')
  }

  #expandArchived() {
    cy.waitLoadingOverlayNotExist()
    cy.scrollTo('bottom')
    cy.get('a[data-toggle="collapse"]')
      .as('toggle')
      .invoke('attr', 'aria-expanded')
      .then(($isExpanded) => {
        if (!$isExpanded) {
          cy.get('@toggle').click()
        }
      })
  }

  #archiveCourseInstance(subject) {
    if (subject !== undefined) {
      cy.wrap(subject).within(($instance) => {
        this._itcArchiveInstance.set()
        this._itcFetchCourseInstances.set()
        this.#clickOnDropdownOption($instance, Field.ARCHIVE)
        cy.wrap($instance).swal2().swal2Confirm(Field.YES_ARCHIVE).click()
        this._itcArchiveInstance.wait()
        this._itcFetchCourseInstances.wait()
      })
    }
  }

  archiveInstanceByTitle(instanceTitle) {
    this.#getInstanceByTitle(instanceTitle).then(($wrapper) => {
      this.#archiveCourseInstance($wrapper)
    })
  }

  #archiveInstanceBy(instanceDate) {
    this.#getFirstActiveInstanceByDate(instanceDate).then(($wrapper) => {
      this.#archiveCourseInstance($wrapper)
    })
  }

  #deleteInstance(subject) {
    if (subject !== undefined) {
      cy.wrap(subject).within(($archiveInstance) => {
        this._itcDeleteInstance.set()
        this._itcFetchCourseInstances.set()
        this.#clickOnDropdownOption($archiveInstance, Field.DELETE)
        cy.wrap($archiveInstance).swal2().swal2Confirm(Field.YES_DELETE).click()
        this._itcDeleteInstance.wait()
        this._itcFetchCourseInstances.wait()
      })
    }
  }

  #deleteArchiveInstanceBy(instanceDate) {
    this.#getFirstArchiveInstanceByDate(instanceDate).then(($wrapper) => {
      this.#deleteInstance($wrapper)
    })
  }

  #deleteInstancesByTitle(instanceTitle) {
    const tableIndex = 1
    this.#getInstanceByTitle(instanceTitle, tableIndex).then(($wrapper) => {
      this.#deleteInstance($wrapper)
    })
  }

  #clickOnDropdownOption($wrapper, option) {
    cy.wrap($wrapper).getThreeDots().click()
    cy.wrap($wrapper).clickDropdownName(option)
  }

  #invokeInstanceContent($instance, $index = 2) {
    return cy.wrap($instance).find(`td:nth-child(${$index})`).invoke('text')
  }

  #getBaseInvokeContentEntry($instance, invokeContentIndex, callback = () => {}) {
    let instances = []
    cy.wrap(instances).as('instances')
    this.#invokeInstanceContent($instance, invokeContentIndex).then(($text) => {
      callback($text, instances)
    })
    return cy.get('@instances')
  }

  #invokeInstanceContentTitle($instance) {
    return this.#getBaseInvokeContentEntry(
      $instance,
      this.#invokeContentTitleIndex,
      ($text, instances) => {
        if ($text.startsWith(Field.AU)) {
          instances = instances.concat($instance)
          cy.wrap(instances).as('instances')
        }
      }
    )
  }

  #invokeInstanceContentDate($instance, instanceDate) {
    return this.#getBaseInvokeContentEntry(
      $instance,
      this.#invokeContentDateIndex,
      ($text, instances) => {
        if (
          $text.trim() === Field.NOT_AVAILABLE ||
          $text.trim() === Field.DASH ||
          $text.split(Field.TIMES)[0].trim() === instanceDate
        ) {
          instances = instances.concat($instance)
          cy.wrap(instances).as('instances')
        }
      }
    )
  }

  #getTableInstances(index) {
    cy.wrap([]).as('rows')
    cy.get('table.course-instance-list')
      .eq(index)
      .then(($table) => {
        if ($table.find('tbody > tr').length) {
          cy.wrap($table).find('tbody > tr').as('rows')
        }
      })
    return cy.get('@rows')
  }

  #getActiveInstancesByDate(instanceDate) {
    return this.#getInstances(instanceDate, this.#activeInstancesIndex)
  }

  #getArchiveInstancesByDate(instanceDate) {
    return this.#getInstances(instanceDate, this.#archiveInstancesIndex)
  }

  #appendInstances(instanceList, entryInstances) {
    instanceList.push.apply(instanceList, entryInstances)
    cy.wrap(instanceList).as('instanceList')
  }

  #getInstances(instanceDate, index) {
    let instanceList = []
    cy.wrap(instanceList).as('instanceList')
    this.#getTableInstances(index).each(($instance) => {
      this.#invokeInstanceContentTitle($instance).then((instancesByTitle) => {
        if (instancesByTitle.length) {
          this.#appendInstances(instanceList, instancesByTitle)
        } else {
          this.#invokeInstanceContentDate($instance, instanceDate).then((instancesByDate) => {
            if (instancesByDate.length) {
              this.#appendInstances(instanceList, instancesByDate)
            }
          })
        }
      })
    })
    return cy.get('@instanceList')
  }

  #getInstanceByTitle(instanceTitle, tableIndex = 0) {
    cy.wrap(undefined).as('courseInstance')
    cy.wait(3000)
    cy.get('h1:contains("Course Instances")')
      .next()
      .within(() => {
        cy.get('div.row')
          .eq(tableIndex)
          .within(($list) => {
            if ($list.find(`span[title="${instanceTitle}"]`).length) {
              cy.get(`span[title="${instanceTitle}"]`)
                .parent()
                .parent()
                .within(($row) => {
                  cy.wrap($row).as('courseInstance')
                })
            }
          })
      })
    return cy.get('@courseInstance')
  }

  expectToSeeInstanceInManageInstance(instanceTitle) {
    this.#getInstanceByTitle(instanceTitle).should('be.visible')
  }
}

export default CopManageInstance
