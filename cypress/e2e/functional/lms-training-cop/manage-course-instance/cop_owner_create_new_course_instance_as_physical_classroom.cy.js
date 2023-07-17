import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import Epic from '../../../../classes/Epic'
import CopOwnerCreateInstance from '../../../../classes/lms-training-cop/create-instance/CopOwnerCreateInstance'
import Story from '../../../../classes/Story'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  context(Story.manageCourseInstance, () => {
    console.log(`CoP Owner create new instance as Physical Classroom`)
    const copOwnerCreateInstance = new CopOwnerCreateInstance()
    copOwnerCreateInstance.setDeliveryMethod(DeliveryMethod.PHYSICAL_CLASSROOM)
    copOwnerCreateInstance.setTicketNumber('QA-910')
    copOwnerCreateInstance.execute()
  })
})
