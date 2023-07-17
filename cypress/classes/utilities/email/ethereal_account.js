const { ImapFlow } = require('imapflow')
const simpleParser = require('mailparser').simpleParser

const etherealAccount = async (emailAccount) => {
  if (!emailAccount) throw new Error('Require email account')
  const client = new ImapFlow({
    host: 'ethereal.email',
    port: 993,
    secure: true,
    auth: {
      user: emailAccount.user,
      pass: emailAccount.pass,
    },
  })
  const userEmail = {
    async getLastEmail() {
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
        lock.release()
      }

      // log out and close connection
      await client.logout()

      const mail = await simpleParser(message.source)

      return {
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachments,
      }
    },
    async deleteSeenEmails() {
      await client.connect()

      let message

      let lock = await client.mailboxOpen('INBOX')
      try {
        message = await client.messageDelete({ seen: true })
      } finally {
        lock.release()
      }

      await client.logout()

      return message
    },
    async searchEmail(subject) {
      console.log(subject)
      await client.connect()

      let message

      let lock = await client.getMailboxLock('INBOX')
      try {
        message = await client.search({
          seen: false,
          or: [{ flagged: true }, { subject: subject }],
        })
      } finally {
        lock.release()
      }

      await client.logout()

      const mail = await simpleParser(message.source)

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

module.exports = etherealAccount
