const notesRouter = require('express').Router()
const Note = require('../models/note')

/*
  The event handler function accepts two parameters.
  1. The first request parameter contains all of the information of the HTTP request,
  2. The second response parameter is used to define how the request is responded to.
  */
  app.get('/', (request, response) => {
    Note
      .find({})
      .then(notes => response.json(notes))
      .catch(error => response.json(error))
  })
  
  /*
    The error that is passed forwards is given to the next function as a parameter.
    If next was called without a parameter, then the execution would simply move onto the
    next route or middleware. If the next function is called with a parameter, then the execution
    will continue to the error handler middleware.
    */
  app.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if(note){
          response.json(note)
        }
        else{
          response.status(404).end()
        }
      })
      .catch(error => {console.log(error); next(error)})//400: bad request! error specifies format of id is incorrect
  })
    /*
    The event handler function can access the data from the body property of the request object.
    Without the json-parser, the body property would be undefined.
  
    The json-parser functions so that it takes the JSON data of a request,
    transforms it into a JavaScript object and then attaches it to the body
    property of the request object before the route handler is called.
    */
  
    app.post('/', (request, response, next) => {
        const body = request.body
        console.log('in post', body)
        
        //Notice that calling return is crucial, because otherwise the code will execute to the
        //very end and the malformed note gets saved to the application.
        if (body.content === undefined ) {
            return response.status(400).json({
            error: 'content missing'
            })
        }
        
        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date()
        })
        
        note.save().then(savedNote => {
            response.json(savedNote)
        })
            .catch(error => next(error))
        })

  app.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id).then(result => {
      response.status(204).end()
    })
      .catch(error => next(error))
  })
  
  app.put('/:id', (request, response, next) => {
    
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