import Environment from '../../base/Environment'

const environment = new Environment()

function getFireCloudFullCatalogUrl() {
  return Cypress.env('orgFullCatalogUrl')['fireCloud'][environment.getEnvPrefix()]
}

function orgUrl() {
  if (environment.isPrd()) return '/web/firecloud-zone/'
  else return '/web/weblearn/'
}

function orgName() {
  if (environment.isPrd()) return 'FireCloud Zone'
  else return 'WebLearn'
}

function rootOrgName() {
  if (environment.isPrd()) return 'FireCloud Zone International'
  else return 'WebLearn International'
}

function rootOrgUrl() {
  if (environment.isPrd()) return '/web/firecloud-zone-international'
  else return '/web/weblearn-international'
}

function envOrgName() {
  return environment.isPrd() ? 'fireCloud' : 'webLearn'
}
function orgFullCatalogId() {
  return Cypress.env('orgFullCatalogId')[envOrgName()][environment.getEnvPrefix()]
}
function orgFullCatalogUrl() {
  return (
    Cypress.env('orgFullCatalogUrl')[envOrgName()][environment.getEnvPrefix()] + '/manage-courses'
  )
}
function orgDemoName() {
  if (environment.isPrd()) return 'Demo KH'
  else return 'Demo-Frontier'
}

export const Tabs = Object.freeze({
  MANAGE_COMMUNITIES: orgUrl() + 'manage-communities',
  MANAGE_CONSENTS: orgUrl() + 'manage-consents',
  MANAGE_STORAGE: orgUrl() + 'manage-storage',
  MANAGE_USERS: orgUrl() + 'manage-users',
  ORGANIZATION_SETTINGS: orgUrl() + 'organization-settings',
  ORGANIZATION_STRUCTURE: orgUrl() + 'organization-structure',
})

export const OrgConst = {
  NAME: orgName(),
  ROOT_ORG_NAME: rootOrgName(),
  NAME_DEMO: orgDemoName(),
  URL: orgUrl(),
  ROOT_ORG_URL: rootOrgUrl(),
  TABS: Tabs,
  FULL_CATALOG_ID: orgFullCatalogId(),
  LEARNING_ADMIN_URL: orgFullCatalogUrl(),
  ENV_NAME: envOrgName(),
  FIRE_CLOUD_FULL_CATALOG_URL: getFireCloudFullCatalogUrl(),
}
