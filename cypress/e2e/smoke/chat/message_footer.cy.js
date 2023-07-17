// import Emoji from '../../../classes/chat/Emoji'
// import MessageFooter from '../../../classes/chat/MessageFooter'
// import MessageInput from '../../../classes/chat/MessageInput'
// import Messaging from '../../../classes/chat/Messaging'

// describe.skip('Chat', () => {
//   let messageText
//   let messageTextLong
//   let messaging
//   const messageFooter = new MessageFooter()
//   const messageInput = new MessageInput()
//   const emoji = new Emoji()
//   before(() => {
//     cy.readFile('cypress/fixtures/chat-resources.yaml').then(
//       (chatResourceString) => {
//         const chatResources = YAML.parse(chatResourceString)
//         const roomName = chatResources.room.webLearnInternationalLegacy
//         messageText = chatResources.message.shortText
//         messageTextLong = chatResources.message.longText
//         messaging = new Messaging(roomName)
//       }
//     )
//   })

//   beforeEach(() => {
//     cy.visitThenSignIn(
//       '/u/home/dashboard',
//       'OrgMgtUsers.orgMgt.admins.organization'
//     )
//     messaging.accessToMessage()
//   })

//   context('Chat Message Input & Send', () => {
//     it('Verify message input empty state', () => {
//       cy.wait(1000)
//       messageFooter.captureMainAreaFooter('chat-main-area-footer-empty-state')
//     })
//     it('Verify emoji general', () => {
//       //TODO: Noted - this case is not stable because the elements randomly render a bit different height
//       emoji.captureEmojiGeneral()
//     })

//     it('Verify message input with a message', () => {
//       messageInput.typeMessage(messageText)
//       messageFooter.captureMainAreaFooter('chat-main-area-footer')
//     })
//     it('Verify message input with attachment', () => {
//       messageInput.addAttachment('/attachments/Banner1.jpg')
//       messageInput.addAttachment('/attachments/Banner2.jpg')
//       messageInput.addAttachment('/attachments/Banner3.jpg')
//       messageFooter.captureMainAreaFooter(
//         'chat-main-area-footer-with-attachment'
//       )
//     })
//     it('Verify message input with a long text message', () => {
//       messageInput.typeMessage(messageTextLong)
//       messageFooter.captureMainAreaFooter(
//         'chat-main-area-footer-message-text-long'
//       )
//     })
//     it('Verify message input with a message and emoji', () => {
//       messageInput.typeMessage(messageText)
//       emoji.add()
//       emoji.react(54)
//       emoji.react(48)
//       emoji.react(55)
//       emoji.react(25)
//       emoji.add()
//       messageFooter.captureMainAreaFooter('chat-main-area-footer-with-emoji')
//     })

//     it('Verify message input with a message, emoji, and attachments', () => {
//       messageInput.addAttachment('/attachments/Banner1.jpg')
//       messageInput.addAttachment('/attachments/Banner2.jpg')
//       messageInput.addAttachment('/attachments/Banner3.jpg')
//       messageInput.typeMessage(messageText)
//       emoji.add()
//       emoji.react(54)
//       emoji.react(48)
//       emoji.react(55)
//       emoji.react(25)
//       emoji.add()
//       messageFooter.captureMainAreaFooter(
//         'chat-main-area-footer-with-message-emoji-and-attachment'
//       )
//     })
//   })
// })
