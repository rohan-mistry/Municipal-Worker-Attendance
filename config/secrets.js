require('dotenv').config()

exports.secrets = {
  db: {
    name: process.env.DB_NAME,
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  email: {
    id:process.env.EMAIL_ID,
    password:process.env.EMAIL_PASSWORD
  },
  auth: {
    signKey: process.env.SIGN_KEY
  }
}