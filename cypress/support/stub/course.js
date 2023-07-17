import Faker from '../../classes/utilities/Faker'
import YamlHelper from '../../classes/utilities/YamlHelper'

const stub = (yamlName, alias, course, courseInstance) => {
  const faker = new Faker()
  let courseObj = null

  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper(yamlName)
    .read()
    .its('Courses', { log: false })
    .then((courses) => {
      courseInstance
        ? (courseObj = courses[course]['courseInstances'][courseInstance])
        : (courseObj = courses[course])

      if (courseObj.url) {
        faker.setPathFixture(courseObj)
        courseObj['id'] = faker.getUrlId()
      }
      cy.wrap(courseObj).as(alias)
    })
}

Cypress.Commands.add('stubCourse', (yamlName, course) => {
  stub(yamlName, 'course', course)
})

Cypress.Commands.add('stubCourseInstance', (yamlName, course, courseInstance) => {
  stub(yamlName, 'courseInstance', course, courseInstance)
})
