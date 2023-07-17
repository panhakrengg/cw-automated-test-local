import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let ctgObj
  const setupCategory = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-instance').read().then(({ Categories }) => {
      ctgObj = Categories.ctgInstance
    })
  })

  context(Story.lmsChangeLogCourseInstance, () => {
    it('Ctg Func Training Reports', () => {
      setupCategory.setCategoryObject(ctgObj)

      SignInAs.learningAdminEmery()
      setupCategory.visitThenAddUsers()
    })
  })
})
