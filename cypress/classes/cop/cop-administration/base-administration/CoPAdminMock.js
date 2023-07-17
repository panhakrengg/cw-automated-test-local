import YamlHelper from '../../../utilities/YamlHelper'

class CoPAdminMock {
  #copInfoObject

  constructor() {
    this.copInfo = new YamlHelper('cop-administration/cop-info')
  }

  setSmokeCommunity() {
    this.copInfo.read().then(({ SmokeCommunityAdministration }) => {
      this.#setCoPObject(SmokeCommunityAdministration)
    })
  }
  setCommunityVisibility() {
    this.copInfo.read().then(({ FuncCommunityVisibility }) => {
      this.#setCoPObject(FuncCommunityVisibility)
    })
  }
  setCommunityMembership() {
    this.copInfo.read().then(({ FuncCommunityMembership }) => {
      this.#setCoPObject(FuncCommunityMembership)
    })
  }
  setCommunitySettings() {
    this.copInfo.read().then(({ FuncCommunitySettings }) => {
      this.#setCoPObject(FuncCommunitySettings)
    })
  }

  #setCoPObject(copObject) {
    this.#copInfoObject = copObject
  }

  #getCoPObject() {
    return this.#copInfoObject
  }

  /* START ******** Get CoP Names ********/
  _getCoPNameUrl(copObjectName) {
    return this.#getCoPObject()[copObjectName].name.value
  }
  getCwTCoPSmokeNameUrl() {
    return this._getCoPNameUrl('cwTCoPSmoke')
  }
  getMwCoPSmokeNameUrl() {
    return this._getCoPNameUrl('mwCoPSmoke')
  }
  getOCoPSmokeNameUrl() {
    return this._getCoPNameUrl('oCoPSmoke')
  }
  getTCoPSmokeNameUrl() {
    return this._getCoPNameUrl('tCoPSmoke')
  }
  getTPCoPSmokeNameUrl() {
    return this._getCoPNameUrl('tPCoPSmoke')
  }
  getMwCoPUnlistedNameUrl() {
    return this._getCoPNameUrl('mwCoPUnlisted')
  }
  getOCoPUnlistedNameUrl() {
    return this._getCoPNameUrl('oCoPUnlisted')
  }
  getTCoPUnlistedNameUrl() {
    return this._getCoPNameUrl('tCoPUnlisted')
  }
  getTPCoPUnlistedNameUrl() {
    return this._getCoPNameUrl('tPCoPUnlisted')
  }
  getOCoPStandardNameUrl() {
    return this._getCoPNameUrl('oCoPStandard')
  }
  getTCoPStandardNameUrl() {
    return this._getCoPNameUrl('tCoPStandard')
  }
  getTPCoPStandardNameUrl() {
    return this._getCoPNameUrl('tPCoPStandard')
  }
  getMWCoPStandardNameUrl() {
    return this._getCoPNameUrl('mwCoPStandard')
  }
  getMWCoPFuncStandardName() {
    return this._getCoPNameUrl('mwCoPFuncStandard')
  }
  getOrgCoPFuncStandardName() {
    return this._getCoPNameUrl('orgCoPFuncStandard')
  }
  getTCoPFuncStandardName() {
    return this._getCoPNameUrl('tCoPFuncStandard')
  }
  getTPCoPFuncStandardName() {
    return this._getCoPNameUrl('tPCoPFuncStandard')
  }
  getMWCoPFuncUnlistedName() {
    return this._getCoPNameUrl('mwCoPFuncUnlisted')
  }
  getOrgCoPFuncUnlistedName() {
    return this._getCoPNameUrl('orgCoPFuncUnlisted')
  }
  getTCoPFuncUnlistedName() {
    return this._getCoPNameUrl('tCoPFuncUnlisted')
  }
  getTPCoPFuncUnlistedName() {
    return this._getCoPNameUrl('tPCoPFuncUnlisted')
  }
  getMwCoPCanJoinName() {
    return this._getCoPNameUrl('mwCoPCanJoin')
  }
  getTPCoPCanJoinName() {
    return this._getCoPNameUrl('tPCoPCanJoin')
  }
  getOCoPCanJoinName() {
    return this._getCoPNameUrl('oCoPCanJoin')
  }
  getTCoPCanJoinName() {
    return this._getCoPNameUrl('tCoPCanJoin')
  }
  getMwCoPPublishName() {
    return this._getCoPNameUrl('mwCoPPublish')
  }
  getOCoPPublishName() {
    return this._getCoPNameUrl('oCoPPublish')
  }
  getTCoPPublishName() {
    return this._getCoPNameUrl('tCoPPublish')
  }
  getTPCoPPublishName() {
    return this._getCoPNameUrl('tpCoPPublish')
  }
  getMwCoPCannotJoinName() {
    return this._getCoPNameUrl('mwCoPCannotJoin')
  }
  getTPCoPCannotJoinName() {
    return this._getCoPNameUrl('tpCoPCannotJoin')
  }
  getOCoPCannotJoinName() {
    return this._getCoPNameUrl('oCoPCannotJoin')
  }
  getTCoPCannotJoinName() {
    return this._getCoPNameUrl('tCoPCannotJoin')
  }
  /* END ******** Get CoP Names ********/

  /* START ******** Get CoP Admin Urls ********/
  _getCoPAdminUrl(copObjectName) {
    return this.#getCoPObject()[copObjectName].admin.url
  }
  getCwTCoPSmokeAdminUrl() {
    return this._getCoPAdminUrl('cwTCoPSmoke')
  }
  getMwCoPSmokeAdminUrl() {
    return this._getCoPAdminUrl('mwCoPSmoke')
  }
  getOCoPSmokeAdminUrl() {
    return this._getCoPAdminUrl('oCoPSmoke')
  }
  getTCoPSmokeAdminUrl() {
    return this._getCoPAdminUrl('tCoPSmoke')
  }
  getTPCoPSmokeAdminUrl() {
    return this._getCoPAdminUrl('tPCoPSmoke')
  }
  getMWCoPFuncStandardAdminUrl() {
    return this._getCoPAdminUrl('mwCoPFuncStandard')
  }
  getOrgCoPFuncStandardAdminUrl() {
    return this._getCoPAdminUrl('orgCoPFuncStandard')
  }
  getTCoPFuncStandardAdminUrl() {
    return this._getCoPAdminUrl('tCoPFuncStandard')
  }
  getTPCoPFuncStandardAdminUrl() {
    return this._getCoPAdminUrl('tPCoPFuncStandard')
  }
  getMWCoPFuncUnlistedAdminUrl() {
    return this._getCoPAdminUrl('mwCoPFuncUnlisted')
  }
  getOrgCoPFuncUnlistedAdminUrl() {
    return this._getCoPAdminUrl('orgCoPFuncUnlisted')
  }
  getTCoPFuncUnlistedAdminUrl() {
    return this._getCoPAdminUrl('tCoPFuncUnlisted')
  }
  getTPCoPFuncUnlistedAdminUrl() {
    return this._getCoPAdminUrl('tPCoPFuncUnlisted')
  }
  getMwCoPCanJoinAdminUrl() {
    return this._getCoPAdminUrl('mwCoPCanJoin')
  }
  getTPCoPCanJoinAdminUrl() {
    return this._getCoPAdminUrl('tPCoPCanJoin')
  }
  getOCoPCanJoinAdminUrl() {
    return this._getCoPAdminUrl('oCoPCanJoin')
  }
  getTCoPCanJoinAdminUrl() {
    return this._getCoPAdminUrl('tCoPCanJoin')
  }
  getMwCoPPublishAdminUrl() {
    return this._getCoPAdminUrl('mwCoPPublish')
  }
  getOCoPPublishAdminUrl() {
    return this._getCoPAdminUrl('oCoPPublish')
  }
  getTCoPPublishAdminUrl() {
    return this._getCoPAdminUrl('tCoPPublish')
  }
  getTPCoPPublishAdminUrl() {
    return this._getCoPAdminUrl('tpCoPPublish')
  }
  getMwCoPCannotJoinAdminUrl() {
    return this._getCoPAdminUrl('mwCoPCannotJoin')
  }
  getTPCoPCannotJoinAdminUrl() {
    return this._getCoPAdminUrl('tpCoPCannotJoin')
  }
  getOCoPCannotJoinAdminUrl() {
    return this._getCoPAdminUrl('oCoPCannotJoin')
  }
  getTCoPCannotJoinAdminUrl() {
    return this._getCoPAdminUrl('tCoPCannotJoin')
  }
  /* END ******** Get CoP Admin Urls ********/

  /* START ******** Get CoP Home Urls ********/
  _getCoPHomeUrl(copObjectName) {
    return this.#getCoPObject()[copObjectName].url
  }
  getMwCoPUnlistedHomeUrl() {
    return this._getCoPHomeUrl('mwCoPUnlisted')
  }
  getOCoPUnlistedHomeUrl() {
    return this._getCoPHomeUrl('oCoPUnlisted')
  }
  getTCoPUnlistedHomeUrl() {
    return this._getCoPHomeUrl('tCoPUnlisted')
  }
  getTPCoPUnlistedHomeUrl() {
    return this._getCoPHomeUrl('tPCoPUnlisted')
  }
  getOCoPStandardHomeUrl() {
    return this._getCoPHomeUrl('oCoPStandard')
  }
  getTCoPStandardHomeUrl() {
    return this._getCoPHomeUrl('tCoPStandard')
  }
  getMwCoPCanJoinHomeUrl() {
    return this._getCoPHomeUrl('mwCoPCanJoin')
  }
  getTPCoPCanJoinHomeUrl() {
    return this._getCoPHomeUrl('tPCoPCanJoin')
  }
  getOCoPCanJoinHomeUrl() {
    return this._getCoPHomeUrl('oCoPCanJoin')
  }
  getTCoPCanJoinHomeUrl() {
    return this._getCoPHomeUrl('tCoPCanJoin')
  }
  getMwCoPPublishHomeUrl() {
    return this._getCoPHomeUrl('mwCoPPublish')
  }
  getOCoPPublishHomeUrl() {
    return this._getCoPHomeUrl('oCoPPublish')
  }
  getTCoPPublishHomeUrl() {
    return this._getCoPHomeUrl('tCoPPublish')
  }
  getTPCoPPublishHomeUrl() {
    return this._getCoPHomeUrl('tpCoPPublish')
  }
  getMwCoPCannotJoinHomeUrl() {
    return this._getCoPHomeUrl('mwCoPCannotJoin')
  }
  getTPCoPCannotJoinHomeUrl() {
    return this._getCoPHomeUrl('tpCoPCannotJoin')
  }
  getOCoPCannotJoinHomeUrl() {
    return this._getCoPHomeUrl('oCoPCannotJoin')
  }
  getTCoPCannotJoinHomeUrl() {
    return this._getCoPHomeUrl('tCoPCannotJoin')
  }
  /* END ******** Get CoP Home Urls ********/
}
export default CoPAdminMock
