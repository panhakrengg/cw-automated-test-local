import InterceptReq from '../../base/InterceptReq'
import HelpGuideFixture from '../../utilities/HelpGuideFixture'
import Field from '../../constants/Field'

class ModifyBannerScreen {
  _itcModifyBanner = new InterceptReq('/help-guide/edit-banner*', 'ModifyBanner')
  _itcBannerDetail = new InterceptReq('/help-guide/fetch-banner-detail', 'BannerDetail')

  modify() {
    let helpGuideFixture = new HelpGuideFixture()

    helpGuideFixture.getData()

    cy.get('@helpGuideAdmin').then((helpGuideAdmin) => {
      const banner = helpGuideAdmin.banner.data

      this._itcModifyBanner.set()
      cy.get('.cec-card__right-content >.cec-card__body').within(($modify) => {
        cy.wrap($modify).inputFormGroup(banner.pageTitle.label, banner.pageTitle.value)
        cy.wrap($modify).inputTextAreaFormGroup(
          banner.shortDescription.label,
          banner.shortDescription.value
        )
        cy.wrap($modify).clickPrimaryButton(Field.SAVE)
      })

      this._itcModifyBanner.getResponse().then(() => {
        cy.expectToastMessage('Banner saved.')
      })
    })
  }
  interceptBannerDetail() {
    this._itcBannerDetail.set()
  }
  waitBannerDetail() {
    this._itcBannerDetail.wait()
  }
}
export default ModifyBannerScreen
