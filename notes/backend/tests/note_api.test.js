const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

//Let's initialize the database before every test with the beforeEach function:
const Note = require('../models/note')
const { json } = require('express')

console.log('initialnotes', helper.initialNotes[0])


beforeEach(async () => {
  await Note.deleteMany({}) //resets test database
  console.log('db cleared')

/* 
   //Since the execution of tests begins immediately after beforeEach has finished executing,
   //the execution of tests begins before the database state is initialized.
  
   helper.initialNotes.forEach(async (note) => {
      let noteObject = new Note(note)
      await noteObject.save()
      console.log('saved')
  });
  console.log('done')

*/

/*
 The returned values of each promise in the array can still be accessed when using the Promise.all method.
 If we wait for the promises to be resolved with the await syntax const results = await Promise.all(promiseArray) ...
 the operation will return an array that contains the resolved values for each promise in the promiseArray, 
 and they appear in the same order as the promises in the array.

  const noteObjects = helper.initialNotes
      .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
*/
  

  //guarantees specific execution order
  for( let note of helper.initialNotes ){
      let noteObject = new Note(note)
      await noteObject.save()
  }
 
})

// ----------------

test('notes are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 50000)

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
}, 50000)

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
}, 50000)

test('a valid note can be added', async () => {
  //login and token authorization check not implemented
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() //retrieves notes in db using helper func
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)   
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
}, 50000)

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
}, 50000)

test('a specific note can be viewed', async () =>{
    const notesAtStart = await helper.notesInDb() //await here to ensure db is connected 
    const noteToView = notesAtStart[0]

    const resultNote = await api //resultNote.body is accessible
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView).replace('\/', '')) 
    const rectifiedResultNote = JSON.parse(JSON.stringify(resultNote.body).replace('\/', ''))
    console.log('processed note from db', processedNoteToView)
    console.log('rectifiedNote from api request (:id)', rectifiedResultNote)

    expect(rectifiedResultNote).toEqual(processedNoteToView)
    
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
  
    const notesAtEnd = await helper.notesInDb()
  
    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )
  
    const contents = notesAtEnd.map(r => r.content)
  
    expect(contents).not.toContain(noteToDelete.content)
})

afterAll(() => {
  mongoose.connection.close()
})