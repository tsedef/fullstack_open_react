require('dotenv').config({ path: '../.env' })
// console.log('config envir', process.env)

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET

console.log('current db:', MONGODB_URI)
module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}