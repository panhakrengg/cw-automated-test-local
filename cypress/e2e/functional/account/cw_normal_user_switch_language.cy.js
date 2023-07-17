import Account from '../../../classes/account/Account'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Account, () => {
  const account = new Account()
  const menuData = {
    avatarMenu: {
      myProfile: 'Meu Perfil',
      accountSettings: 'Configurações da Conta',
      signOut: 'Sair',
    },
    accountSettingMenu: {
      generalSettings: 'Configurações gerais',
      notifications: 'Notificações',
      twoStepVerification: 'Verificação em duas etapas',
      consents: 'Consentimentos',
      activityLog: 'Registro de atividades',
    },
    previewProfileAsMenu: {
      someoneConnectedToMe: 'Someone connected to me',
      anyLoggedInUser: 'Jeder auf der Plattform',
    },
  }

  context(Story.generalSettingLanguage, () => {
    before(() => {
      SignInAs.switchLangUser()
      account.visitAccountSettings()
    })

    it('Cw Normal User switch language to PT', () => {
      Story.ticket('QA-891')
      account.resetLanguageToEn()
      account.selectLanguageAndSave('pt_BR')
      account.expectedAvatarMenuItemsChanged(menuData.avatarMenu)
      account.expectedAccountSettingsMenuItemsChanged(menuData.accountSettingMenu)
    })

    it('Cw Normal User Re-Login and see language has changed to PT', () => {
      Story.ticket('QA-892')
      cy.signOut()
      SignInAs.switchLangUser()
      account.visitAccountSettings()
      account.expectedAvatarMenuItemsChanged(menuData.avatarMenu)
      account.expectedAccountSettingsMenuItemsChanged(menuData.accountSettingMenu)
    })
    // it('Cw Normal User switch language to DE and see fallback to EN', () => {
    // TODO: currently, there is no more DE
    //   Story.ticket('QA-893')
    //   SignInAs.switchLangUser(account.getAccountSettingUrl())
    //   account.selectLanguageAndSave('de_DE')
    //   myProfile.visitMyProfile()
    //   myProfile.expectedPreviewProfileAsFallbackToEN(
    //     menuData.previewProfileAsMenu
    //   )
    // })
  })
})
