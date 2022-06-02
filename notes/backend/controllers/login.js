const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 } //token expires in 60*60 seconds (one hour)
  )
  //Tokens expiring is only one way of ensuring user safety (if there was a potential breach into the account)
  //server-side sessions (save info about each token to backend db and to check for EACH API request if the acces right
  //corresponding to the token is still valid) is a safer, more complex way of managing access rights

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter