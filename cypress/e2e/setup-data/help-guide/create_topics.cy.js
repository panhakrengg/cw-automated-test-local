import AdminHelpGuide from '../../../classes/help-guides/admin/admin.js'
import AdminNavigation from '../../../classes/help-guides/admin/Navigation'
import Topics from '../../../classes/help-guides/admin/topic.js'
import TopicRole from '../../../classes/help-guides/admin/TopicRole'
import AdminHelpGuideLogin from '../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin.js'
import Faker from '../../../classes/utilities/Faker'

describe('Create Topics', () => {
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const adminTopic = new Topics()
  const adminNavigation = new AdminNavigation()
  const adminTopicRole = new TopicRole()
  const faker = new Faker()

  const createTopic = (name) => {
    adminTopic.clickNewTopic()
    adminTopicRole.inputThenCreate(faker.getAuTextNotDelete(name) + 'remove')
  }

  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminToTab('topics')
    adminNavigation.clickTopics()
  })

  it('Learning Management', (topic = 'Learning Management') => {
    createTopic(topic)
  })

  it('Communities of Purpose', (topic = 'Communities of Purpose') => {
    createTopic(topic)
  })

  it('Security', (topic = 'Security') => {
    createTopic(topic)
  })

  it('User Settings', (topic = 'User Settings') => {
    createTopic(topic)
  })
  it('Course Settings', (topic = 'Course Settings') => {
    createTopic(topic)
  })
  it('Course', (topic = 'Course') => {
    createTopic(topic)
  })
  it('Automate', (topic = 'Automate') => {
    createTopic(topic)
  })
})
