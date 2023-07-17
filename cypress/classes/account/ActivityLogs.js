import InterceptReq from '../base/InterceptReq'
import UserAccountUtil from '../utilities/UserAccountUtil'
import CommunityConsentLog from './logs/CommunityConsentLog'
import PersonalCourseLog from './logs/PersonalCourseLog'
import PersonalCourseLogOperation from './logs/PersonalCourseLogOperation'

class ActivityLogs {
  userAccountUtil = new UserAccountUtil()
  itcGetActivityLog = new InterceptReq('/account_setting/activity_logs/get', 'GetActivityLog')
  personalCourseLogOperation = new PersonalCourseLogOperation()
  personalCourseLog = new PersonalCourseLog()
  communityConsentLog = new CommunityConsentLog()

  setPersonalCourseLogData(learner, consentFormName, courseName) {
    this.personalCourseLog.setData(learner, consentFormName, courseName)
  }
  redirectAccountSettingOn(option) {
    cy.visit(`/web/my-profile/account-settings#_accountSettingPortlet_option=${option}`)
  }
  accessActivityLog() {
    cy.wait(3000)
    this.itcGetActivityLog.set()
    this.redirectAccountSettingOn('activity-log')
    this.itcGetActivityLog.wait()
  }
  containTitleInBody(title) {
    cy.get('.cec-card__body')
      .eq(2)
      .within(() => {
        cy.getElementWithLabel(title, 'h1').should('be.visible')
      })
  }
  showCategoryFilter(category) {
    cy.get('.cec-card__left-content').within(() => {
      cy.getElementWithLabel(category, 'a').should('be.visible')
    })
  }
  clickFilterActivityBy(category = 'Profile Updates') {
    cy.wait(2000)
    this.itcGetActivityLog.set()
    cy.get('.cec-card__left-content').within(() => {
      cy.getElementWithLabel(category, 'a').last().click()
    })
    this.itcGetActivityLog.wait()
    cy.wait(1000)
  }
  clickViewDetail() {
    cy.getElementWithLabel('View details', 'div').then(($viewDetail) => {
      cy.wrap($viewDetail).find('a').click()
    })
  }
  showNoActivityMessage() {
    cy.getElementWithLabel('No activity yet.', 'span').should('be.visible')
  }
  getCurrentDate() {
    return this.userAccountUtil.getDateByDefaultTimeZoneAndFormat()
  }
  getLogProfileImageTokenId() {
    return new Promise((resolve) => {
      cy.get('.image__wrapper > img')
        .invoke('attr', 'data-url')
        .then(($src) => {
          const url = location.origin + $src
          cy.getExtractUrlFromContent(url).then(($url) => {
            resolve($url.searchParams.get('img_id_token'))
          })
        })
    })
  }
  #verifyActivityLogBy(date, log, index = 0, time, callback = () => {}) {
    cy.get('.activity-log-list').within(() => {
      cy.getElementWithLabel(date, 'p').should('be.visible').parent().as('dateWrapper')
      cy.get('@dateWrapper').within(() => {
        cy.getElementWithLabel(log, 'span')
          .eq(index)
          .should('be.visible')
          .parents('div.border-radius-10')
          .parent()
          .within(($logItem) => {
            if (time != 'empty') {
              time ? cy.expectElementWithLabelVisible(time, 'p') : this.containLogHour()
            }
            callback()
            cy.wrap($logItem).as('logWrapper')
          })
      })
    })
  }
  containLogUpdateProfileImage(username, imageToken) {
    const log = `${username} updated profile photo.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.getElementWithLabel('(Only Me)', 'span').should('be.visible')
      cy.getElementWithLabel('(Platform)', 'div').should('be.visible')
      this.getLogProfileImageTokenId().then(($imageTokenId) => {
        expect(imageToken).to.be.equal($imageTokenId)
      })
    })
  }
  containLogUpdateProfileAboutMe(username, imageToken, content) {
    const log = `${username} updated about me.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.getElementWithLabel('None', 'span').should('be.visible')
      cy.getElementWithLabel(content, 'span').should('be.visible')
      this.getLogProfileImageTokenId().then(($imageTokenId) => {
        expect(imageToken).to.be.equal($imageTokenId)
      })
    })
  }
  containLogHour() {
    const time = this.userAccountUtil.getDateByDefaultTimeZone()
    cy.get(`p:contains(${time.format('h')}:)`).should('be.visible')
  }
  expectFoundCourseConsent(log, courseTitle) {
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.expectElementWithLabelVisible(`Course: ${courseTitle}`, 'div.pt-1')
    })
  }
  expectFoundGaveCourseConsent(courseTitle) {
    this.expectFoundCourseConsent(this.personalCourseLog.textLogGaveCourseConsent(), courseTitle)
  }
  expectFoundRevokeCourseConsent(courseTitle) {
    this.expectFoundCourseConsent(this.personalCourseLog.textLogRevokeCourseConsent(), courseTitle)
  }
  expectFoundCommunityConsent(log, copName) {
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.expectElementWithLabelVisible(`Community: ${copName}`, 'div.pt-1')
    })
  }
  expectFoundGaveCommunityConsent(copName) {
    this.expectFoundCommunityConsent(
      this.communityConsentLog.textLogGaveCommunityConsent(),
      copName
    )
  }
  expectFoundRevokeCommunityConsent(copName) {
    this.expectFoundCommunityConsent(
      this.communityConsentLog.textLogRevokeCommunityConsent(),
      copName
    )
  }
  expectFoundDisabledCourseConsent() {
    this.personalCourseLogOperation.findingLog(
      this.personalCourseLog.textLogDisabledCourseConsent()
    )
  }
  expectFoundEnabledCourseConsent() {
    this.personalCourseLogOperation.findingLog(this.personalCourseLog.textLogEnabledCourseConsent())
  }
  expectFoundUsedPredefinedCourseConsent() {
    this.personalCourseLogOperation.findingLog(
      this.personalCourseLog.textLogUsedPredefinedCourseConsentForm()
    )
  }
  containLogUpdateProfileSetPrimaryCop(username, imageToken, oldCopName, newCopName) {
    const log = `${username} updated primary CoP.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.getElementWithLabel(oldCopName, 'span').should('be.visible')
      cy.getElementWithLabel(newCopName, 'span').should('be.visible')
      this.getLogProfileImageTokenId().then(($imageTokenId) => {
        expect(imageToken).to.be.equal($imageTokenId)
      })
    })
  }
  containLogUpdateProfileExpertiseMyFocus(username, imageToken, items = []) {
    const log = `${username} updated expertise & qualifications.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      cy.get('.image__wrapper')
        .siblings('div')
        .last()
        .within(() => {
          cy.get('.pt-1.w-100 > div').as('changeItemList')
        })

      cy.get('@changeItemList').within(() => {
        items.forEach((item, index) => {
          cy.get('div')
            .eq(index)
            .within(() => {
              cy.getElementWithLabel('None', 'span').should('be.visible')
              cy.getElementWithLabel(item, 'span').should('be.visible')
            })
        })
      })

      this.getLogProfileImageTokenId().then(($imageTokenId) => {
        expect(imageToken).to.be.equal($imageTokenId)
      })
    })
  }
  containLogUpdateProfileGlobalSearchSettings(username, imageToken) {
    const log = `${username} updated global search settings.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, 0, null, () => {
      this.getLogProfileImageTokenId().then(($imageTokenId) => {
        expect(imageToken).to.be.equal($imageTokenId)
      })
    })
  }
  containLogRequestToJoinCop(userName, copName) {
    const log = `${userName} requested to join ${copName}`
    this.#verifyActivityLogBy(this.getCurrentDate(), log)
  }
  containLogAcceptToJoinCop(userName, copName, time, date, index = 0) {
    const log = `${userName} accepted an invitation to join ${copName}`
    this.#verifyActivityLogBy(date, log, index, time)
  }
  containLogPostTo(userName, copName, date, index = 0) {
    const log = `${userName} posted to ${copName}`
    this.#verifyActivityLogBy(date, log, index)
  }
  getLogProfileImageTokenId() {
    return new Promise((resolve) => {
      cy.get('.image__wrapper > img')
        .invoke('attr', 'data-url')
        .then(($src) => {
          const url = location.origin + $src
          cy.getExtractUrlFromContent(url).then(($url) => {
            resolve($url.searchParams.get('img_id_token'))
          })
        })
    })
  }
  containLogEditPostIn(userName, copName, date) {
    const log = `${userName} edited a post in ${copName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogSharedPostFromCopToCop(userName, fromCopName, toCopName, date) {
    const log = `${userName} shared a post from ${fromCopName} to ${toCopName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogAcceptAccessRequestToJoinCop(approver, requester, copName, date) {
    const log = `${approver} accepted ${requester}'s request to join ${copName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogRemoveMemberFromCop(admin, member, copName, date) {
    const log = `${admin} removed ${member} from ${copName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogInviteMemberToJoinCop(admin, user, copName, date) {
    const log = `${admin} invited ${user} to join ${copName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogChangeMemberRole(admin, member, copName, date) {
    const log = `${admin} changed ${member}'s role in ${copName}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogRenameFileOrFolderInCop(userName, copName, fileOrFolderName, date, index = 0) {
    const log = `${userName} renamed a file/folder in ${copName}`
    this.#verifyActivityLogBy(date, log, index, null, () => {
      cy.getElementWithLabel(fileOrFolderName, 'div').should('be.visible')
    })
  }
  containLogSendConnectionRequest(sender, receiver, date) {
    const log = `${sender} sent a connection request to ${receiver}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogAcceptedConnectionRequest(sender, receiver, date) {
    const log = `${sender} accepted a connection request from ${receiver}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogUpdateCertificateShowInMyProfile(userName, activities = [], logContent, date) {
    const log = `${userName} ${logContent}`
    this.#verifyActivityLogBy(date, log, 0, null, () => {
      this.viewActivityLogDetailsForVisibility(activities)
    })
  }
  viewActivityLogDetailsForVisibility(activities = []) {
    cy.getElementWithLabel('View details', 'div').then(($viewDetail) => {
      cy.wrap($viewDetail).find('a').click()
      cy.wrap($viewDetail)
        .siblings('div[role="tabpanel"]')
        .within(() => {
          activities.forEach((item) => {
            cy.getElementWithLabel(item.name, 'b').should('be.visible')
            cy.getElementWithLabel(item.oldVisibility, 'div').should('be.visible')
            cy.getElementWithLabel(item.newVisibility, 'span').should('be.visible')
          })
        })
    })
  }
  containLogBookedTheCourse(learner, courseTitle, date) {
    const log = `${learner} booked the course ${courseTitle}`
    this.#verifyActivityLogBy(date, log)
  }
  containLogCompletedTheCourse(learner, courseTitle, time, date) {
    const log = `${learner} completed the course ${courseTitle}`
    this.#verifyActivityLogBy(date, log, 0, time)
  }
  containLogDownloadCertificateCourse(learner, courseTitle, date, index = 0) {
    const log = `${learner} downloaded a completion certificate for the Course ${courseTitle}`
    this.#verifyActivityLogBy(date, log, index)
  }
  containLogSignInToCw(userName, date, index = 0) {
    const log = `${userName} signed in.`
    this.#verifyActivityLogBy(date, log, index)
  }
  containLogSignOutFromCw(userName, date, index = 0) {
    const log = `${userName} signed out.`
    this.#verifyActivityLogBy(date, log, index)
  }
  containLogEnabled2FA(userName, index = 0) {
    const log = `${userName} enabled 2-step verification.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, index)
  }
  containLogDisabled2FA(userName, index = 0) {
    const log = `${userName} disabled 2-step verification.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, index)
  }
  containLogEnabled2FAMethod(userName, index = 0, method = 'Email') {
    const log = `${userName} enabled a 2-step verification method.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, index, null, () => {
      cy.getElementWithLabel(method, 'div').should('be.visible')
    })
  }
  containLogDisabled2FAMethod(userName, index = 0, method = 'Email') {
    const log = `${userName} disabled a 2-step verification method.`
    this.#verifyActivityLogBy(this.getCurrentDate(), log, index, null, () => {
      cy.getElementWithLabel(method, 'div').should('be.visible')
    })
  }
  containLogEditCertificate(listItems) {
    cy.get('@logWrapper').within(() => {
      this.clickViewDetail()
      cy.get('div.col-12').each(($field) => {
        cy.wrap($field)
          .should('be.visible')
          .invoke('text')
          .then(($text) => {
            expect(listItems).to.include($text)
          })
      })
    })
  }
  containLogText(date, text, index = 0) {
    this.#verifyActivityLogBy(date, text, index, 'empty')
    cy.get('@logWrapper').within(() => {
      cy.get('div.text-black')
        .invoke('text')
        .then(($text) => {
          expect($text.trim()).to.equal(text)
        })
    })
  }
  containLogDisabledCertificate(date, userName, orgName, index = 0) {
    const content = `${userName} disabled learning certificate of completion for ${orgName}.`
    this.containLogText(date, content, index)
  }
  containLogEditCertificateTemplate(date, userName, orgName, index = 0) {
    const content = `${userName} edited certificate template for ${orgName}.`
    this.containLogText(date, content, index)
  }
}

export default ActivityLogs
