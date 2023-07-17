import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let activity
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-activity-library')
      .read()
      .its('ArchiveActivityLibrary.file.sOActivityFileArchiveLog')
      .then((data) => {
        activity = data
      })

    setupActivityLibrary.itcSearchActivityLibrary.set()
  })

  context(Story.lmsChangeLogActivityLibrary, () => {
    it('Setup file activity "SOActivity file for archive - check log"', () => {
      SignInAs.orgAdmin_Amy(setupActivityLibrary.getActivityLibraryOrgUrl())
      setupActivityLibrary.createFile(activity)
    })
  })
})
