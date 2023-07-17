import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let ctgObj
  const setupCategory = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/lms-admin-training-reports/training-reports')
      .read()
      .then(({ Categories }) => {
        ctgObj = Categories.ctgFuncTrainingReport
      })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Ctg Func Training Reports', () => {
      setupCategory.setCategoryObject(ctgObj)

      new SignInLmsAs().lnAdmin_Emery()
      setupCategory.createNewCategory()
      setupCategory.addUsers()
      setupCategory.changeAdminRole()
    })
  })
})
