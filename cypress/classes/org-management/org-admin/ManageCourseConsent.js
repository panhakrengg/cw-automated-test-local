import Environment from '../../base/Environment'
import InterceptAction from '../../base/InterceptAction'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import EmailHelper from '../../utilities/EmailHelper'
import { OrgConst } from '../base-org-management/OrgStub'
import ManageConsent from './ManageConsent'

class ManageCourseConsent {
  #courseName
  #environment = new Environment()
  #mailHelper = new EmailHelper()
  #orgName = 'fireCloud'
  #manageConsent = new ManageConsent()

  constructor(courseName) {
    this.#courseName = courseName
  }
  #itcFetchCourses = new InterceptReq('/manage_courses/fetch', 'fetchCourses')
  #itcFetchConsentInstance = new InterceptReq(
    '/setting/consent/instance/get',
    'fetchConsentInstance'
  )
  #itcFetchCourseProperties = new InterceptReq('/course/properties', 'fetchCourseProperties')
  #itcFetchPredefinedForms = new InterceptReq(
    '/setting/consent/fetch_predefined_forms',
    'fetchPredefinedForms'
  )
  #itcSaveConsentForm = new InterceptReq('/setting/consent/save_consent_form', 'SaveConsentForm')
  #itcFetchConsentForm = new InterceptReq('/consent_form/fetch', 'FetchConsentForm')
  #itcConsentSearch = new InterceptReq('/setting/consent/search', 'ConsentSearch')
  #itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'FetchCourseActivities'
  )
  #itcAgreeConsentForm = new InterceptAction('/consent_form/agree', 'AgreeConsentForm')
  #itcFetchCourseInstanceMembers = new InterceptReq(
    '/course/get_members',
    'FetchCourseInstanceMembers'
  )
  #itcRemoveMember = new InterceptReq('/manage_people/remove', 'removeMember')
  #itcSearchUsers = new InterceptReq('/manage_people/users/search', 'searchUsers')
  #itcAddMemer = new InterceptReq('/manage_member/add', 'addMember')
  #itcFetchSettingConsent = new InterceptReq('/setting/consent/fetch', 'fetchSettingConsent')

  setCourseName(courseName) {
    this.#courseName = courseName
  }
  accessCourseDetail(courseId, role) {
    this.#itcFetchConsentForm.set()
    cy.visitThenSignIn(`/web/ci${courseId}/course-detail`, role)
    this.#itcFetchConsentForm.wait()
  }
  accessToManageCourses() {
    this.#itcFetchCourses.set()
    this.getManageCourseUrl(OrgConst.NAME).then(cy.visit)
    this.#itcFetchCourses.wait()
  }
  accessToManageCourse() {
    this.accessToManageCourses()
    cy.get('.cw-top-header__search-input')
      .inputSearch('Search courses')
      .type(`"${this.#courseName}" {enter}`)
    this.#itcFetchCourses.wait()
    this.#itcFetchCourseProperties.set()
    cy.get(`a:contains("${this.#courseName}")`).first().click()
    this.#itcFetchCourseProperties.wait()
  }
  clickSidebarManageConsent() {
    this.#itcFetchConsentInstance.set()
    cy.get('.cec-card__right-content').within(($rightContent) => {
      cy.wrap($rightContent).get('.nav').contains('Manage Consent').click()
    })
    this.#itcFetchConsentInstance.wait()
  }
  accessToManageConsent() {
    this.accessToManageCourse()
    this.clickSidebarManageConsent()
  }
  accessToManageConsentBy(courseId) {
    this.#itcFetchConsentInstance.set()
    this.getManageCourseUrl(OrgConst.NAME).then((url) => {
      cy.visit(url + this.getManageConsentPostUrl(courseId))
    })
    this.#itcFetchConsentInstance.wait()
  }
  getUrlOrgLms(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}${this.getManageConsentPostUrl(courseId)}`
  }
  getManageConsentPostUrl(courseId) {
    return `?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=consent-management&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit`
  }
  accessToCiManagePeopleBy(courseInstanceId, courseId, orgName = this.#orgName) {
    if (!courseInstanceId || !courseId) throw Error('Please define id')
    this.#itcFetchCourseInstanceMembers.set()
    this.getManageCourseUrl(orgName).then((url) => {
      cy.visit(
        url +
          `?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${courseInstanceId}&_learningAdminManageCoursesPortlet_tab=overview&_learningAdminManageCoursesPortlet_courseId=${courseId}#_learningAdminManageCoursesPortlet_tab=people`
      )
    })
    this.#itcFetchCourseInstanceMembers.wait()
  }
  #clickCreateCustomForm() {
    cy.getElementWithLabel('Create a Custom Form', '.create-custom-consent-from').click()
  }
  #clickButtonSave() {
    this.#itcFetchConsentInstance.set()
    this.#itcConsentSearch.set()
    cy.clickButtonByName(Field.SAVE)
    this.#itcFetchConsentInstance.wait()
    this.#itcConsentSearch.wait()
  }
  createCustomForm(form) {
    this.clickSidebarManageConsent()
    this.clickToEnableConsentForm()
    this.#clickCreateCustomForm()
    this.#manageConsent.fillCustomForm(form)
    this.#clickButtonSave()
  }
  removeCourseInstanceMember(memberEmail) {
    cy.waitLoadingOverlayNotExist()
    cy.get('.manage-people').within(($managePeople) => {
      cy.wrap($managePeople)
        .get('.table-wrapper')
        .eq(1)
        .as('members')
        .invoke('text')
        .then(($text) => {
          if ($text.includes(memberEmail)) {
            cy.get('@members')
              .find('td')
              .contains(memberEmail)
              .parents('tr')
              .within(($courseInstanceMember) => {
                cy.wrap($courseInstanceMember).getThreeDots().click()
                cy.wrap($courseInstanceMember).clickDropdownName(Field.REMOVE)
              })
            this.#itcRemoveMember.set()
            cy.wrap($managePeople).swal2Confirm(Field.YES_REMOVE).click()
            this.#itcRemoveMember.wait()
          }
        })
    })
  }
  addMemberToCourseInstance(memberScreenName) {
    this.#itcSearchUsers.set()
    cy.getElementWithLabel('Add Learners', 'button').click()
    this.#itcSearchUsers.wait()
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).get('input[placeholder="Search users by name"]').type(memberScreenName)
      cy.wait(300)
      this.#itcSearchUsers.wait()
      cy.wrap($popup).get('.scroll-content-area').find('label').contains(memberScreenName).click()
      this.#itcAddMemer.set()
      cy.wrap($popup).find('button').contains(Field.ADD).click()
      this.#itcAddMemer.wait()
    })
  }
  getManageCourseUrl() {
    return cy.wrap(OrgConst.LEARNING_ADMIN_URL)
  }
  enable() {
    this.#itcFetchPredefinedForms.set()
    cy.get('.consent-card').within(($consentCard) => {
      cy.wrap($consentCard).get('.slider').click()
    })
    this.#itcFetchPredefinedForms.wait()
  }
  expectNotAvailablePredefinedForm(name) {
    cy.get('.scroll-content > .justify-content-between').should('not.contain.text', name)
  }
  #getBaseConsentFormContainer(callback = () => {}) {
    cy.get('.consent-card.cec-p-4').within(($wrapper) => {
      cy.wrap($wrapper)
        .get('.cw-toggle-button')
        .within(($content) => {
          callback($content)
        })
    })
  }
  clickToEnableConsentForm() {
    this.#getBaseConsentFormContainer(($content) => {
      cy.wrap($content).toggleSwitch()
    })
  }
  enableConsentForm() {
    cy.wrap(false).as('enableConsent')
    this.#getBaseConsentFormContainer(($content) => {
      cy.wrap($content)
        .parent()
        .within(($wrapper) => {
          if ($wrapper.find(`span:contains(${Field.ENABLE})`).length) {
            cy.wrap(true).as('enableConsent')
          }
        })
    })
    return cy.get('@enableConsent')
  }
  replaceConsent() {
    cy.get('.manage-consent').within(() => {
      cy.contains('span', 'Consent Form')
        .parent()
        .parent()
        .find('div.consent-card')
        .within(($consentCard) => {
          cy.wrap($consentCard)
            .get('#_learningAdminManageCoursesPortlet_dropdownMenuLinkdropdownThreeDots')
            .click()
          this.#itcFetchPredefinedForms.set()
          cy.wrap($consentCard).clickDropdownName(Field.REPLACE)
          cy.waitLoadingOverlayNotExist()
          this.#itcFetchPredefinedForms.wait()
        })
    })
  }
  #shouldResetPredefinedConsentForm(name, callback = () => {}) {
    cy.wrap(false).as('shouldReplace')
    cy.swal2()
      .getSwal2Content()
      .within(($content) => {
        if (
          $content.find(`.scroll-content > .justify-content-between:contains("${name}")`).length
        ) {
          cy.contains('.scroll-content > .justify-content-between', name)
            .invoke('attr', 'class')
            .then((classes) => {
              if (!classes.includes('selected-form')) {
                cy.wrap(true).as('shouldReplace')
              }
            })
        } else {
          callback()
        }
      })
    return cy.get('@shouldReplace')
  }
  selectPredefinedConsentForm(name) {
    this.#shouldResetPredefinedConsentForm(name).then(($shouldReplace) => {
      if ($shouldReplace) {
        cy.swal2()
          .getSwal2Content()
          .within(() => {
            cy.contains('.scroll-content > .justify-content-between', name).click()
            cy.clickPrimaryButton(Field.NEXT)
            cy.clickPrimaryButton(Field.REPLACE)
          })
        this.#itcSaveConsentForm.set()
        cy.swal2Confirm(Field.YES_REPLACE).click()
        this.#itcSaveConsentForm.wait()
      }
    })
  }
  expectLearnerSeeConsentPopupAndAccept(courseId, role, verify) {
    cy.signOut()
    this.accessCourseDetail(courseId, role)
    this.agreeConsentForm()
    if (verify) this.verifyConsentPopupAfterAgreed()
    cy.signOut()
  }
  verifyConsentPopupAfterAgreed() {
    cy.reload()
    this.#itcFetchConsentForm.wait()
    this.#itcFetchCourseActivities.wait()
    cy.getPopup().should('not.exist')
  }
  agreeConsentForm() {
    cy.getPopup().as('consentPopup')
    cy.get('@consentPopup')
      .getPopupBody()
      .within(($popup) => {
        cy.wrap($popup).getCheckboxList().as('consentItems')
      })
    cy.get('@consentItems').each((element) => {
      cy.wrap(element).getCheckbox().check()
    })
    this.#itcFetchCourseActivities.set()
    this.#itcAgreeConsentForm.set()
    cy.get('@consentPopup')
      .getPopupFooter()
      .within(() => {
        cy.contains('button', Field.YES_I_AGREE).click()
      })
    this.#itcAgreeConsentForm.wait()
    this.#itcFetchConsentForm.wait()
    this.#itcFetchCourseActivities.wait()
  }
  verifyReplaceConsentEmail(newConsent, oldConsent, otherInfo, isOwner) {
    const subject = `Changes to Consent Form in ${otherInfo['courseTitle']}`
    const userName = isOwner ? 'You' : otherInfo['user']['givenName']
    this.#mailHelper
      .getReceivedEmail(subject, otherInfo['recipient']['email'], true)
      .emailTableBody()
      .then((template) => {
        this.#mailHelper.setTemplate(template)
        this.#mailHelper.verifyText(subject, 'p')
        this.#mailHelper.verifyText(`Dear ${otherInfo['recipient']['givenName']},`, 'div')
        this.#mailHelper.verifyText(
          `${userName} made changes to the consent form in ${otherInfo['courseTitle']}.`,
          'div'
        )
        this.#mailHelper.verifyText('Review the form below.', 'div')
        this.#mailHelper.verifyText('Previous Form')
        this.#mailHelper.verifyText(Field.DESCRIPTION)
        this.#mailHelper.verifyText('Consent items', 'p')
        this.#mailHelper.verifyText(newConsent['name']['new'])
        this.#mailHelper.verifyText(oldConsent['name']['new'])
        this.#mailHelper.verifyText(newConsent['desc']['new'], 'p')
        this.#mailHelper.verifyText(oldConsent['desc']['new'], 'p')
        this.verifyReplaceConsentItem(newConsent)
        this.verifyReplaceConsentItem(oldConsent)
        if (otherInfo['courseTitle']) {
          this.#mailHelper.verifyLinkButton(
            `Manage Consent in ${otherInfo['courseTitle']}`,
            this.getManageConsentPostUrl(otherInfo['courseId'])
          )
        }
        this.#mailHelper.verifyEmailFooter()
      })
  }
  verifyReplaceConsentItem(consent) {
    const customItems = Object.entries(consent['consentItems']['customItems'])
    for (let i = 0; i < customItems.length; i++) {
      this.#mailHelper.verifyText(
        `${customItems[i][1]['consentDescription']['textEditor']['value']['new']}`,
        'p'
      )
      if (customItems[i][1]['optional']['new']) {
        this.#mailHelper.verifyText('(optional)', 'i')
      }
    }
  }

  #reClickEditIfTextEditorMissing() {
    cy.textEditorExist(cy.cardMainContent()).then(($exist) => {
      if (!$exist) {
        this.#itcConsentSearch.set()
        cy.clickBackLink()
        this.#itcConsentSearch.wait()
        this.#clickDropdownItemEdit()
      }
    })
  }

  #clickDropdownItemEdit() {
    this.#itcFetchSettingConsent.set()
    cy.getElementWithLabel('Consent Form', 'span')
      .parent()
      .siblings()
      .within(($card) => cy.wrap($card).clickDropdownItem(Field.EDIT))
    this.#itcFetchSettingConsent.wait()
  }

  editCustomForm(form) {
    this.#manageConsent.fillCustomForm(form, true)
    this.#clickButtonSave()
  }

  logInThenVisit(callback = () => {}) {
    this.#itcFetchConsentInstance.set()
    callback()
    this.#itcFetchConsentInstance.wait()
  }

  resetConsentForm(newFormName, previousForm) {
    this.#clickDropdownItemEdit()
    this.#reClickEditIfTextEditorMissing()
    this.#manageConsent
      .getFormNameInput()
      .invoke('val')
      .then((name) => {
        if (name == newFormName) {
          this.editCustomForm(previousForm)
          this.#clickDropdownItemEdit()
        }
      })
  }
}

export default ManageCourseConsent
