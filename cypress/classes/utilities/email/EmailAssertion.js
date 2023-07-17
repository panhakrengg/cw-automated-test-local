class EmailAssertion {
  #template
  #cwCopyRight = '© Khalibre Pte Ltd. All rights reserved.'
  #cwTradeMark =
    'Crosswired, the Crosswired Logo and Crosswired Globe are registered trademarks of Khalibre Pte Ltd. All other product names and logos are the trademarks or registered trademarks of their respective owners.'
  #cwPowerBy = 'Powered by Crosswired.'
  #notificationUrl =
    '/web/my-profile/account-settings?p_p_id=accountSettingPortlet&p_p_lifecycle=0&_accountSettingPortlet_mvcRenderCommandName=%2F#_accountSettingPortlet_option=notifications'

  setTemplate(template) {
    this.#template = template
  }

  verifyEmailFooter() {
    this.verifyLinkButton('Manage your email notifications', this.#notificationUrl)
    this.verifyText(this.#cwCopyRight, 'p')
    this.verifyText(this.#cwTradeMark, 'p')
    this.verifyText(this.#cwPowerBy)
  }

  verifyText(value, tag = 'span') {
    if (this.#template !== undefined) {
      const entryElement = this.#template.find(`${tag}:contains("${value}")`)
      if (this.#template && entryElement.length) {
        expect(entryElement.text()).contain(value)
      }
    }
  }

  verifyTextInTemplate(value) {
    if (this.#template !== undefined) {
      const content = this.#template[0].textContent
      if (content) {
        expect(content).to.contains(value)
      }
    }
  }

  verifyLinkButton(name, url, alias = 'cwLink') {
    if (this.#template) {
      const linkButton = this.#template.find(`a:contains("${name}")`)
      expect(linkButton.text()).contain(name)
      cy.wrap(linkButton)
        .invoke('attr', 'href')
        .then(($url) => {
          expect($url).to.contain(url)
          cy.wrap($url).as(alias)
        })
    }
  }
}

export default EmailAssertion
