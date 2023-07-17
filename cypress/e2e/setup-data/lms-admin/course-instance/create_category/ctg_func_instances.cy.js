import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let ctgObj, ctgName, members
  const setupCategory = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/course-instance/archive-instance')
      .read()
      .its('CategoryData.ctgFuncInstances')
      .then((ctgFuncInstances) => {
        ctgObj = ctgFuncInstances
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseInstance, () => {
    it('Ctg Func Instances', () => {
      setupCategory.setCategoryObject(ctgObj)

      setupCategory.createNewCategory()
      setupCategory.addUsers()
      setupCategory.changeAdminRole()
    })
  })
})
