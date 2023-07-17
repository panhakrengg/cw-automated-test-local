import LmsAdminIntercept from '../../../interception/LmsAdminIntercept'
import CertificateConstant from '../constants/CertificateConstant'
import CertificateItc from '../intercepts/CertificateItc'
import CertificateQuery from '../queries/CertificateQuery'
export default class CertificateAction extends CertificateQuery {
  constructor() {
    super()
  }
  clickCertificateNav() {
    CertificateItc.itcFetchInitialCertificate.set()
    this.getLabelCertificate().click()
    CertificateItc.itcFetchInitialCertificate.wait()
  }

  getCertificateCard() {
    cy.cardRightContent().within(() => {
      cy.get(this.getCertificateElementId()).as('certificateCard')
    })
  }
  clickEditCertificateLink() {
    this.getCertificateCard()
    CertificateItc.itcFetchCertificate.set()
    CertificateItc.itcFetchAvailableLanguages.set()

    cy.get('@certificateCard').within(() => {
      cy.clickLinkByName(CertificateConstant.EDIT_CERTIFICATE)
    })

    CertificateItc.itcFetchCertificate.wait()
    CertificateItc.itcFetchAvailableLanguages.wait()
  }
  updateCertificateContent(data, reset = true) {
    let suffix = reset ? '' : CertificateConstant.UPDATED
    this.getCertificateContentBlock().within(() => {
      this.getInputCertificate().clear().type(data.certificate.value.concat(suffix))
      this.getInputOfCompletion().clear().type(data.ofCompletion.value.concat(suffix))
      this.getInputIsPresentedTo().clear().type(data.isPresentedTo.value.concat(suffix))
      this.getInputForSuccessfullyCompleting()
        .clear()
        .type(data.forSuccessfullyCompleting.value.concat(suffix))
      this.getInputIssuedOn().clear().type(data.issueOn.value.concat(suffix))
      this.getInputName1().clear().type(data.authorEmery.name.value.concat(suffix))
      this.getInputPosition1().clear().type(data.authorEmery.position.value.concat(suffix))
      this.getInputName2().clear().type(data.authorBritney.name.value.concat(suffix))
      this.getInputPosition2().clear().type(data.authorBritney.position.value.concat(suffix))
    })
  }
  clickSave() {
    this.getButtonSave()
      .invoke('attr', 'disabled')
      .then((disabled) => {
        if (!disabled) {
          cy.clickButtonByName(CertificateConstant.SAVE)
          cy.expectToastMessage(CertificateConstant.CERTIFICATE_HAS_BEEN_SAVED)
          cy.waitUntilToastDisappear()
        }
      })
  }
  visitCourseInstancePeopleTab(instanceUrl) {
    LmsAdminIntercept._itcGetMembers.set()
    LmsAdminIntercept._itcGetAdminMembers.set()
    cy.visit(instanceUrl)
    LmsAdminIntercept._itcGetMembers.wait()
    LmsAdminIntercept._itcGetAdminMembers.wait()
  }
  addLearner(name) {
    cy.clickButtonByName(CertificateConstant.ADD_LEARNERS)

    cy.getPopup().within(($popup) => {
      cy.wrap($popup).checkPopupHeader(CertificateConstant.ADD_LEARNERS)
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          LmsAdminIntercept._itcSearchUsersManagePeople.set()
          cy.inputByPlaceholder(CertificateConstant.SEARCH_USERS_BY_NAME, name)
          LmsAdminIntercept._itcSearchUsersManagePeople.wait()
          cy.wait(1000)
          cy.getCheckbox().first().check()
        })
      LmsAdminIntercept._itcAddManageMember.set()
      LmsAdminIntercept._itcGetMembers.set()
      cy.wrap($popup)
        .getPopupFooter()
        .within(() => {
          cy.clickButtonByName(CertificateConstant.ADD)
        })
      LmsAdminIntercept._itcAddManageMember.wait()
      LmsAdminIntercept._itcGetMembers.wait()
    })
  }
  removeLearnerIfExists(email) {
    cy.wait(1000)
    this.getManageLearnerTable().then(($table) => {
      if ($table.find(`td:contains(${email})`).length) {
        cy.getElementWithLabel(email, 'td')
          .first()
          .parents('tr')
          .within(($tr) => {
            cy.wrap($tr).clickDropdownItem(CertificateConstant.REMOVE).as('item')
          })
        LmsAdminIntercept._itcRemoveMemberRole.set()
        cy.get('@item').swal2().swal2Confirm(CertificateConstant.YES_REMOVE).click()
        LmsAdminIntercept._itcRemoveMemberRole.wait()
        cy.reload()
      }
    })
  }
  changeLearningStatusOfLearner(email, learningStatus = CertificateConstant.IN_PROGRESS) {
    this.getManageLearnerTable().within(() => {
      cy.getElementWithLabel(email, 'td')
        .parent()
        .within(($item) => {
          cy.wrap($item).clickDropdownItem(CertificateConstant.CHANGE_LEARNING_STATUS).as('popup')
          cy.get('@popup')
            .swal2()
            .within(($swal2) => {
              cy.getSwal2Content().within(() => {
                cy.clickCwDropdownItem(learningStatus)
                LmsAdminIntercept._itcUpdateMemberStatus.set()
                cy.wrap($swal2).btnConfirm(CertificateConstant.CHANGE).click()
                LmsAdminIntercept._itcUpdateMemberStatus.wait()
              })
            })
        })
    })
  }
  downloadCertificate() {
    cy.clickButtonByName('View Certificate (English)')
    cy.verifyDownload(`${CertificateConstant.CERTIFICATE}.pdf`)
  }
  takeCourseActivity() {
    cy.getElementWithLabel('Course Activities', 'h1')
      .next()
      .click()
      .within(() => {
        cy.getElementWithLabel('Enter Link', 'a').click().as('popup')
        cy.get('@popup').swal2().swal2Confirm(CertificateConstant.CONTINUE).click()
      })
  }
  removeCertificateLanguage(language) {
    cy.getElementWithLabel(language, 'span').next().click()
  }
  addCertificateLanguageIfNotExists(language) {
    this.getLanguageSection().then(($section) => {
      if (!$section.find(`span:contains(${language})`).length) {
        this.getAddLanguageIcon().click()
        cy.getPopup().within(($popup) => {
          cy.wrap($popup).checkPopupHeader(CertificateConstant.ADD_CONTENT_LANGUAGE)
          cy.wrap($popup)
            .getPopupBody()
            .within(() => {
              cy.getElementWithLabel(language, 'span').prev().click()
            })
          cy.wrap($popup)
            .getPopupFooter()
            .within(() => {
              CertificateItc.itcFetchPlaceholders.set()
              cy.clickButtonByName(CertificateConstant.ADD)
              CertificateItc.itcFetchPlaceholders.wait()
              cy.waitLoadingOverlayNotExist()
            })
        })
      }
    })
  }
  removeCertificateLanguageIfExists(language) {
    this.getLanguageSection().then(($section) => {
      if ($section.find(`span:contains(${language})`).length) {
        this.removeCertificateLanguage(language)
      }
    })
  }
  disableAwardCourseCompletionCertificateIfEnabled() {
    this.getAwardCertificateToggleSwitch()
    cy.get('@awardCertificateSwitch').then(($val) => {
      if ($val.is(':checked')) {
        this.disableAwardCourseCompletionCertificate()
      }
    })
  }
  disableAwardCourseCompletionCertificate() {
    cy.get('@awardCertificateSwitch').uncheck({ force: true }).should('not.checked')
    this.saveCourse()
  }
  enableAwardCourseCompletionCertificate() {
    cy.get('@awardCertificateSwitch').check({ force: true }).should('be.checked')
    this.saveCourse()
  }
  saveCourse() {
    cy.clickButtonByName(CertificateConstant.SAVE_COURSE)
    cy.expectToastMessage(CertificateConstant.THE_COURSE_HAS_BEEN_SAVED)
  }
  visitMyProfileExpertiseAndQualificationTab() {
    cy.visit('/web/my-profile/profile')
    this.getExpertiseAndQualificationTab().click()
  }
  enableAwardCourseCompletionCertificateIfDisabled() {
    this.getAwardCertificateToggleSwitch()
    cy.get('@awardCertificateSwitch').then(($val) => {
      if (!$val.is(':checked')) {
        this.enableAwardCourseCompletionCertificate()
      }
    })
  }
}
