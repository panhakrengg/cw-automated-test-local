import AdminNavigation from '../../../classes/help-guides/admin/Navigation'
import AdminHelpGuide from '../../../classes/help-guides/admin/admin.js'
import Roles from '../../../classes/help-guides/admin/role.js'
import TopicRole from '../../../classes/help-guides/admin/topicRole.js'
import Faker from '../../../classes/utilities/faker.js'

describe('Create Roles', () => {
  const adminHelpGuide = new AdminHelpGuide()
  const adminRole = new Roles()
  const adminNavigation = new AdminNavigation()
  const adminTopicRole = new TopicRole()
  const faker = new Faker()

  const createRole = (name) => {
    adminRole.clickNewRole()
    adminTopicRole.inputThenCreate(faker.getAuTextNotDelete(name) + 'remove')
  }

  beforeEach(() => {
    adminHelpGuide.signInAsAdminToTab('topics')
    adminNavigation.clickRoles()
  })

  it('Learning Admins', (role = 'Learning Admins') => {
    createRole(role)
  })

  it('Community Admins', (role = 'Community Admins') => {
    createRole(role)
  })

  it('General', (role = 'General') => {
    createRole(role)
  })

  it('Trainers', (role = 'Trainers') => {
    createRole(role)
  })

  it('Organization Admins', (role = 'Organization Admins') => {
    createRole(role)
  })
})
