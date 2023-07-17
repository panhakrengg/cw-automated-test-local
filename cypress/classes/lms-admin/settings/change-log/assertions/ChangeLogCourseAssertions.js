import Field from '../../../../constants/Field'
import { CollaborationSettings, LogLabel, WhoLearnersCanSee } from '../constant/ChangeLogConstant'
import ChangeLogAssertions from './ChangeLogAssertions'

export default class ChangeLogCourseAssertions extends ChangeLogAssertions {
  #usd = 'USD'

  verifyFirstCourseChangeLog(changeLog, callback = () => {}) {
    super.getFirstChangeLogByTitle(changeLog).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      callback() //For expand details
    })
  }

  verifySecondCourseChangeLog(changeLog, callback = () => {}) {
    super.getChangeLogByTitleAndIndex(changeLog, 1).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      callback() //For expand details
    })
  }

  verifyThirdCourseChangeLog(changeLog, callback = () => {}) {
    super.getChangeLogByTitleAndIndex(changeLog, 2).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      callback() //For expand details
    })
  }

  #expectCourseFee(courseFee) {
    let value = 0.0
    let paymentMethod = 'Postpaid'

    if (courseFee) {
      value = courseFee.value
      paymentMethod = courseFee.paymentMethod
    }

    super.expectADetailLogStrong(LogLabel.COURSE_FEE, value)
    super.expectADetailLogStrong(LogLabel.PAYMENT_METHOD, paymentMethod)
  }

  #expectCourseCompletion(courseCompletion) {
    let awardCertificate = Field.DISABLED
    let allowToProfile = Field.ENABLED

    if (courseCompletion) {
      awardCertificate = courseCompletion.awardLearnersWithCertificate
        ? Field.ENABLED
        : Field.DISABLED
      allowToProfile = courseCompletion.allowAddingToProfile ? Field.ENABLED : Field.DISABLED
    }

    cy.expectElementWithLabelVisible(LogLabel.AWARD_LEARNERS, 'b')
      .parents('.cec-mb-1')
      .within(() => cy.expectElementWithLabelVisible(awardCertificate, 'span'))
    cy.expectElementWithLabelVisible(awardCertificate, 'span')

    cy.expectElementWithLabelVisible(LogLabel.ALLOW_ADDING, 'b')
      .parent()
      .parent()
      .within(() => cy.expectElementWithLabelVisible(allowToProfile, 'span'))
  }

  expectToSeeDetailForCreatedCourse(course) {
    const { name, image, courseOverview, uploadFiles, courseFee, categories, courseCompletion } =
      course

    this.changeLogAction.clickLinkCollapseChangeLog()
    super.getCollapseChangeLog().within(() => {
      //Course title
      super.expectADetailLogStrong(LogLabel.COURSE_TITLE, name)
      if (image) {
        super.expectADetailLogStrong(LogLabel.COURSE_IMAGE, LogLabel.ADD_A_NEW_IMAGE)
      }
      //Course overview
      super.expectADetailLogStrong(LogLabel.COURSE_OVERVIEW, courseOverview)
      //Course fee
      this.#expectCourseFee(courseFee)
      if (uploadFiles) {
        const attachment = super.getLogWithMultiValue(uploadFiles.name)
        super.expectADetailLogStrong(LogLabel.COURSE_ATTACHMENT, `added ${attachment}`)
      }
      //Course completion
      this.#expectCourseCompletion(courseCompletion)
      if (categories) {
        const category = super.getLogWithMultiValue(categories)
        super.expectADetailLogStrong(LogLabel.CATEGORIES, category)
      }
    })
  }

  expectToSeeDetailForDeletedCourse(course) {
    this.expectToSeeDetailForCreatedCourse(course)
  }

  expectToSeeDetailForCollaborationCourse(course) {
    const { collaborationSettings } = course
    let connectLog = CollaborationSettings.DISABLED_ENABLED
    let whoLearnerCanSee = WhoLearnersCanSee.ONLY_LEARNERS_SAME_INSTANCE
    let discussionLog = CollaborationSettings.DISABLED_ENABLED

    if (course.collaborationSettings) {
      const { connect, discussion } = collaborationSettings
      if (connect) {
        connectLog = connect.enable ? connectLog : CollaborationSettings.ENABLED_DISABLED
        if (connect.whoLearnersCanSee == CollaborationSettings.ALL_LEARNERS_IN_THIS_COURSE)
          whoLearnerCanSee = WhoLearnersCanSee.ALL_LEARNERS
      }
      if (discussion) {
        discussionLog = discussion.enable ? discussionLog : CollaborationSettings.ENABLED_DISABLED
      }
    }

    this.changeLogAction.clickLinkCollapseChangeLog()
    super.getCollapseChangeLog().within(() => {
      super.expectADetailLogBold(LogLabel.ENABLE_CONNECT, connectLog)
      super.expectADetailLogBold(LogLabel.WHO_CAN_SEE, whoLearnerCanSee)
      super.expectADetailLogBold(LogLabel.ENABLED_DISCUSSIONS, discussionLog)
    })
  }

  expectToSeeDetailForEditedCourse(newCourse, previousCourse) {
    const { name: preName, image, courseOverview: preOverview, courseFee: preFee } = previousCourse
    const {
      name: newName,
      courseOverview: newOverview,
      uploadFiles: newFiles,
      courseFee: newFee,
      categories: newCategories,
    } = newCourse

    this.changeLogAction.clickLinkCollapseChangeLog()
    super.getCollapseChangeLog().within(() => {
      //Course title
      super.expectADetailLogStrong(LogLabel.COURSE_TITLE, `${preName}${newName}`)
      if (image) {
        super.expectADetailLogStrong(LogLabel.COURSE_IMAGE, LogLabel.ADD_A_NEW_IMAGE)
      }
      //Course overview
      cy.expectElementWithLabelVisible(LogLabel.COURSE_OVERVIEW, 'b')
      super.getPanelPrevious().within(() => cy.expectElementWithLabelVisible(preOverview, 'div'))
      super.getPanelNew().within(() => cy.expectElementWithLabelVisible(newOverview, 'div'))
      if (newFee) {
        super.expectADetailLogStrong(
          LogLabel.COURSE_FEE,
          `${this.#usd} ${preFee.value.toFixed(1)}${this.#usd} ${newFee.value.toFixed(1)}`
        )
        super.expectADetailLogStrong(
          LogLabel.PAYMENT_METHOD,
          `${preFee.paymentMethod}${newFee.paymentMethod}`
        )
      }
      if (newFiles) {
        const attachment = super.getLogWithMultiValue(newFiles.name)
        super.expectADetailLogStrong(LogLabel.COURSE_ATTACHMENT, `added ${attachment}`)
      }
      if (newCategories) {
        let category = super.getLogWithMultiValue(newCategories)
        super.expectADetailLogStrong(LogLabel.CATEGORIES, category)
      }
    })
  }

  expectToSeeDetailForEnableDiscussion() {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogBold(LogLabel.ENABLED_DISCUSSIONS, CollaborationSettings.DISABLED_ENABLED)
  }

  expectToSeeDetailForDisableDiscussion() {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogBold(LogLabel.ENABLED_DISCUSSIONS, CollaborationSettings.ENABLED_DISABLED)
  }

  expectToSeeDetailForEnableConnect() {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogBold(LogLabel.ENABLE_CONNECT, CollaborationSettings.DISABLED_ENABLED)
  }

  expectToSeeDetailForDisableConnect() {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogBold(LogLabel.ENABLE_CONNECT, CollaborationSettings.ENABLED_DISABLED)
  }

  expectToSeeDetailForResourcesAsFile(fileName) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogStrong(LogLabel.FILE_NAMES, fileName)
  }

  expectToSeeDetailForResourcesAsFolder(folderName) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    super.expectADetailLogStrong(LogLabel.FOLDER_NAMES, folderName)
  }

  expectToSeeDetailForDeleteResources(resources) {
    const { deleteFiles, deleteFolders } = resources

    this.changeLogAction.clickLinkCollapseChangeLog()
    if (deleteFiles) {
      const logFiles = super.getLogWithMultiValue(deleteFiles)
      super.expectADetailLogStrong(LogLabel.FILE_NAMES, logFiles)
    }
    if (deleteFolders) {
      const logFolders = super.getLogWithMultiValue(deleteFolders)
      super.expectADetailLogStrong(LogLabel.FOLDER_NAMES, logFolders)
    }
  }

  #expectToSeeDetailForConsent(form) {
    const { formName, description, consentItems } = form

    cy.expectElementWithLabelVisible(LogLabel.FORM_NAME, 'strong')
    cy.expectElementWithLabelVisible(formName)

    cy.expectElementWithLabelVisible('Description', 'strong')
    cy.expectElementWithLabelVisible(description)

    cy.expectElementWithLabelVisible(LogLabel.CONSENT_ITEMS, 'strong')
    Object.entries(consentItems).forEach(([, value], index) => {
      cy.expectElementWithLabelVisible(value.shortLabel, 'strong')
        .parents('.cec-py-1')
        .within(() => {
          cy.expectElementWithLabelVisible(index + 1, '.rounded-circle')
          if (value.optional) cy.expectElementWithLabelVisible(LogLabel.OPTIONAL, 'i')
        })
    })
  }

  expectToSeeDetailForCreateConsent(form) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    cy.expectElementWithLabelVisible(LogLabel.CONSENT_FORM, 'b')
      .parents('[role="tabpanel"]')
      .within(() => {
        this.#expectToSeeDetailForConsent(form)
      })
  }

  expectToSeeDetailForEditConsent(newForm, previousForm) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    cy.expectElementWithLabelVisible(LogLabel.CONSENT_FORM, 'b')
      .parents('[role="tabpanel"]')
      .within(() => {
        super.getPanelPrevious().within(() => {
          this.#expectToSeeDetailForConsent(previousForm)
          cy.expectElementWithLabelVisible(LogLabel.EXISTING_MEMBERS_MUST_AGREE, 'strong')
          cy.expectElementWithLabelVisible(
            previousForm.existingMemberMustAgree ? Field.YES : Field.NO
          )
        })
        super.getPanelNew().within(() => {
          this.#expectToSeeDetailForConsent(newForm)
          cy.expectElementWithLabelVisible(LogLabel.EXISTING_MEMBERS_MUST_AGREE, 'strong')
          cy.expectElementWithLabelVisible(newForm.existingMemberMustAgree ? Field.YES : Field.NO)
        })
      })
  }

  verifyFirstSharedCourseChangeLog(changeLog, instancesToShared, callback = () => {}) {
    const instances = instancesToShared ? LogLabel.SPECIFIC_INSTANCES : LogLabel.ALL_INSTANCES

    super.getFirstChangeLogByTitle(changeLog).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      cy.expectElementWithLabelVisible(`${LogLabel.SHARED_INSTANCES} ${instances}`, 'div.cec-mt-2')
      callback() //For expand details
    })
  }

  #expectSharedInstances(instancesToShared) {
    const { share, notShare } = instancesToShared

    Object.entries(share).forEach(([, value]) => {
      cy.expectElementWithLabelVisible(
        `${value.title} (${value.deliveryMethod})`,
        '.align-items-center'
      ).within(() => cy.hasSvgIcon())
    })

    if (notShare)
      Object.entries(notShare).forEach(([, value]) => {
        cy.expectElementWithLabelNotExist(
          `${value.title} (${value.deliveryMethod})`,
          '.align-items-center'
        )
      })
  }

  expectToSeeDetailForSharedInstances(instancesToShared) {
    this.changeLogAction.clickLinkCollapseChangeLog()
    this.#expectSharedInstances(instancesToShared)
  }

  verifyFirstEditDefaultInstanceToShareChangeLog(changeLog, previousIsAll, callback = () => {}) {
    const instance = previousIsAll
      ? `${LogLabel.ALL_INSTANCES}  ${LogLabel.SPECIFIC_INSTANCES}`
      : `${LogLabel.SPECIFIC_INSTANCES}  ${LogLabel.ALL_INSTANCES}`

    super.getFirstChangeLogByTitle(changeLog).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      cy.expectElementWithLabelVisible(`${LogLabel.SHARED_INSTANCES} ${instance}`, 'div.cec-mt-2')
      callback() //For expand details
    })
  }

  #expectPreviousNewEditedCommunityShare(instancesToShared, previousIsAll) {
    previousIsAll
      ? cy
          .expectElementWithLabelVisible(LogLabel.ALL_INSTANCES, '.align-items-center')
          .within(() => cy.hasSvgIcon())
      : this.#expectSharedInstances(instancesToShared)
  }

  expectToSeeDetailForEditCommunityShare(instancesToShared, previousIsAll) {
    this.changeLogAction.clickLinkCollapseChangeLog()

    super
      .getPanelPrevious()
      .last()
      .within(() => this.#expectPreviousNewEditedCommunityShare(instancesToShared, previousIsAll))

    super
      .getPanelNew()
      .last()
      .within(() => this.#expectPreviousNewEditedCommunityShare(instancesToShared, !previousIsAll))
  }

  verifyFirstAllowDuplicationChangeLog(changeLog, isEnable) {
    const duplicate = isEnable
      ? `${Field.DISABLED}  ${Field.ENABLED}`
      : `${Field.ENABLED}  ${Field.DISABLED}`

    super.getFirstChangeLogByTitle(LogLabel.ALLOW_DUPLICATION).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      super.expectADetailLogBold(LogLabel.ALLOW_DUPLICATION, duplicate)
    })
  }

  verifyFirstRequestPermissionChangeLog(changeLog, isEnable) {
    const permission = isEnable
      ? `${Field.DISABLED}  ${Field.ENABLED}`
      : `${Field.ENABLED}  ${Field.DISABLED}`

    super.getFirstChangeLogByTitle(changeLog).within(() => {
      super.expectToSeeLogDateTime()
      cy.expectElementWithLabelVisible(changeLog, 'span')
      super.expectADetailLogBold(LogLabel.PERMISSION_NEEDED, permission)
    })
  }
}
