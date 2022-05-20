const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

  /*
  The event handler function accepts two parameters. 
  1. The first request parameter contains all of the information of the HTTP request, 
  2. The second response parameter is used to define how the request is responded to.
  */
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })
  
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id);
    const note = notes.find(note => {
      console.log(note.id, typeof note.id, id, typeof id, note.id === id)
      return note.id === id
    })
    if (note){
      response.json(note)
    } else{
      response.statusMessage = `note with id number ${id} does not exist`
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  /*
  The event handler function can access the data from the body property of the request object.
  Without the json-parser, the body property would be undefined. 

  The json-parser functions so that it takes the JSON data of a request, 
  transforms it into a JavaScript object and then attaches it to the body 
  property of the request object before the route handler is called.
  */
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    //Notice that calling return is crucial, because otherwise the code will execute to the 
    //very end and the malformed note gets saved to the application.
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })
