import Environment from '../../../../../classes/base/Environment'
import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceTitle, learners
  const setupBooking = new SetUpBooking()

  before(() => {
    cy.stubCommunity(
      'lms-admin/lms-admin-training-reports/training-reports',
      'tCopTrainingReport'
    ).then((community) => {
      courseObj = community.sharedCourses.courseSharedForCheckingTrainingReport
      instanceTitle = courseObj.instanceCoPLearnerBooked.title
      learners = community.copUsers[new Environment().getEnvYaml()].inviteViaEmails
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Book course "Instance Self Study"', () => {
      setupBooking.setCourseObject(courseObj)
      setupBooking.setInstanceObject(instanceTitle)
      learners.forEach((email) => {
        cy.signInViaEmail(email)
        setupBooking.bookCourseBySearchFromGlobalByName(courseObj.name, instanceTitle)
        cy.signOut()
      })
    })
  })
})
