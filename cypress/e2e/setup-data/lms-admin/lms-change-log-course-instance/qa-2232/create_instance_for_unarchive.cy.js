import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-instance').read().then(({ ArchiveInstances }) => {
      courseObj = ArchiveInstances.courseFuncInstanceLog
      instanceObj = courseObj.instanceForUnarchiveLog
    })
  })

  context(Story.lmsChangeLogCourseInstance, () => {
    it('Setup instance "Instance for unarchive to check log"', () => {
      SignInAs.courseAdminGiles()
      new SetUpCourseInstance().createNewInstanceFromManageCourse(courseObj, instanceObj)
    })
  })
})
