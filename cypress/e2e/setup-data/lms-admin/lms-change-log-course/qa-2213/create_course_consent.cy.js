import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpConsent from '../../../../../classes/lms/admin/setup-data/SetUpConsent'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseName, consent

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course').read().then(({ CourseConsents }) => {
      const courseObj = CourseConsents.courseEditConsentLog
      courseName = courseObj.name
      consent = courseObj.manageConsent.previous
    })
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create consent in "Course func for consent & new resources to check log"', () => {
      SignInAs.learningAdminEmery()
      new SetUpConsent().searchCourseThenCreateConsent(courseName, consent)
    })
  })
})
