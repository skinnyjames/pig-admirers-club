import dotenv from 'dotenv'
// @ts-ignore
import MailGun from 'mailgun-es6'

dotenv.config()
const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN 


const mailGun: any = new MailGun({
  privateApi: apiKey,
  domainName: domain
})

export = {
  sendInvite(inviteData: any) {
    const resetPasswordURL = `http://${inviteData.url}/artists/invite?id=${inviteData.guid}`
    const artist = inviteData.artist
    const html = `
      <h1>Hello ${artist.first_name},</h1>
      <p>
        You've been invited to join pigadmirersclub as an artist!
        To complete your registration, please go to <a href="${resetPasswordURL}">${resetPasswordURL}</a>
      </p>    
    `
    return mailGun.sendEmail({
      html: html,
      to: artist.email,
      from: 'notifications@pigadmirersclub.net',
      subject: 'You are invited!'
    })
  }
}