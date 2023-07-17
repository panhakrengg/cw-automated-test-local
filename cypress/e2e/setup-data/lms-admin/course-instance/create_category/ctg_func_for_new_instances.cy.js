import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let ctgName, members
  const setup = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/course-instance/create-new-instances')
      .read()
      .its('CategoryData.ctgFuncForNewInstances')
      .then((ctgFuncForNewInstances) => {
        ctgName = ctgFuncForNewInstances.name.value
        members = ctgFuncForNewInstances.users.addUsers
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseInstance, () => {
    it('Ctg Func for New Instances', () => {
      setup.setCategoryName(ctgName)

      setup.createNewCategory()
      setup.addUsers(members)
    })
  })
})
