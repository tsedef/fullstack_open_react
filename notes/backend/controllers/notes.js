const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

/*
  The event handler function accepts two parameters.
  1. The first request parameter contains all of the information of the HTTP request,
  2. The second response parameter is used to define how the request is responded to.
  */
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
  //The functionality of the populate method of Mongoose is based on the fact that we have defined "types"
  //to the references in the Mongoose schema with the ref option from Schema model
  response.json(notes)

//Standard way of using promise (then chaining) to retrieve data
//   Note
//     .find({})
//     .then(notes => response.json(notes))
//     .catch(error => response.json(error))
})

/*
    The error that is passed forwards is given to the next function as a parameter.
    If next was called without a parameter, then the execution would simply move onto the
    next route or middleware. If the next function is called with a parameter, then the execution
    will continue to the error handler middleware.
    */
notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if(note) {
    response.json(note)
  }else {
    response.status(404).end() //404: not found! error specifies format of id is incorrect
  }
})

const getTokenForm = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')){ //bearer is a type of authentication scheme
    return authorization.substring(7)
  }
  return null
}
/*
    The event handler function can access the data from the body property of the request object.
    Without the json-parser, the body property would be undefined.

    The json-parser functions so that it takes the JSON data of a request,
    transforms it into a JavaScript object and then attaches it to the body
    property of the request object before the route handler is called.
    */
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = getTokenForm(request)
  const decodedToken = jwt.verify(token, config.SECRET) //decodes token if verified and returns object which token was based on
  //object decoded from token contains the username and id fields which tells the serer who made the request
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id) //id is retrieved

  //Notice that calling return is crucial, because otherwise the code will execute to the
  //very end and the malformed note gets saved to the notesRouter location.
  if (body.content === undefined ) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id //uses User model's user._id to establish a link between users and their created notes
  })

  //with async/await, try-catch is the recommended way of dealing with exceptions
  //BUT with express-async-errors... not necessary to handle exceptions.
  //try{
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //id of note is stored in the notes field of User
  await user.save()

  response.status(201).json(savedNote)
  //   } catch(exception) {
  //       //next function passes request handling to error handling middleware!
  //       next(exception)
  //   }

})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
  //POSSIBLE W/O TRY-CATCH BC OF EXPRESS-ASYNC-ERRORS PACKAGE
  //if exception -> execution automatically passed to error handling middleware
})

notesRouter.put('/:id', (request, response, next) => {

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },  //validations are not run by default, need to set explicitly
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter //exports router to be available for all consumers of the module
//all routes are now defined for the Router OBJECT!