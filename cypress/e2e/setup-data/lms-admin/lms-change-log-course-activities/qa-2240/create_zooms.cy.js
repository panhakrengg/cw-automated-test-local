import Epic from '../../../../../classes/Epic'
import SetupZoom from '../../../../../classes/lms/admin/setup-data/SetupZoom'
import Story from '../../../../../classes/Story'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  let zoom
  const setupZoom = new SetupZoom()

  beforeEach(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course-activity').read().then(({ Zooms }) => {
      zoom = Zooms
    })
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Create zoom "Course activity previous log"', () => {
      setupZoom.login.asLearningAdmin()
      setupZoom.createZoom(zoom.previous)
    })
    it('Create zoom "Course activity new log"', () => {
      setupZoom.login.asLearningAdmin()
      setupZoom.createZoom(zoom.new)
    })
  })
})
