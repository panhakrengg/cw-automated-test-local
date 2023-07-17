import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import CourseList from '../../../../../classes/lms/admin/setup-data/CourseList'
import SetupInstancePeople from '../../../../../classes/lms/admin/setup-data/SetupInstancePeople'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let instanceTitle, faci
  const courseList = new CourseList()

  before(() => {
    cy.stubCourse('lms-admin/lms-change-log/log-learning-path', 'publishNoBook').then((data) => {
      const instance = data.noOneBookInstance
      instanceTitle = instance.title
      faci = instance.managePeople.faci
    })
  })

  context(Story.lmsChangeLogLearningPath, () => {
    it('Add faci "Instance on one book"', () => {
      SignInAs.learningAdminEmery()
      courseList.visitThenSearchCourse(false, instanceTitle)
      courseList.click3dotsInstance('People', instanceTitle)
      new SetupInstancePeople().addFaci(faci)
    })
  })
})
