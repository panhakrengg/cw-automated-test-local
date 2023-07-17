// use Nodemailer to get an Ethereal email inbox
// https://nodemailer.com/about/
const nodemailer = require('nodemailer')
// used to fetch emails from the inbox via imap protocol
const { ImapFlow } = require('imapflow')
// used to parse emails from the inbox
const simpleParser = require('mailparser').simpleParser

const makeEmailAccount = async () => {
  testAccount = await nodemailer.createTestAccount()

  const userEmail = {
    user: {
      email: testAccount.user,
      pass: testAccount.pass,
    },

    /**
     * Utility method for getting the last email
     * for the Ethereal email account using ImapFlow.
     */
    async getLastEmail() {
      // Create imap client to connect later to the ethereal inbox and retrieve emails using ImapFlow
      let client = new ImapFlow({
        host: 'ethereal.email',
        port: 993,
        secure: true,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
      // Wait until client connects and authorizes
      await client.connect()

      let message

      // Select and lock a mailbox. Throws if mailbox does not exist
      let lock = await client.getMailboxLock('INBOX')
      try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        message = await client.fetchOne(client.mailbox.exists, { source: true })
        console.log('The message: %s', message.source.toString())

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        for await (let message of client.fetch('1:*', { envelope: true })) {
          console.log(`${message.uid}: ${message.envelope.subject}`)
        }
      } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release()
      }

      // log out and close connection
      await client.logout()

      const mail = await simpleParser(message.source)

      // and returns the main fields + attachments array
      return {
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachments,
      }
    },
  }
  return userEmail
}

module.exports = makeEmailAccount
