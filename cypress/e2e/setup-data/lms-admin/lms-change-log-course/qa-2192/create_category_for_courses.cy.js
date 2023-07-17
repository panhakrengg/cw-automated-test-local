import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let ctgObj
  const setup = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course')
      .read()
      .then(({ Categories }) => (ctgObj = Categories.ctgForCourse))
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new category "Ctg for Courses"', () => {
      setup.setCategoryObject(ctgObj)

      SignInAs.learningAdminEmery()
      setup.createNewCategory()
      setup.addUsers()
      setup.changeAdminRole()
      setup.addUserGroups()
    })
  })
})
