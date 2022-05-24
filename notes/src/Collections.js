import React, { useState, useEffect } from "react"
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from "./components/Notification"

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

const Collections = () => {

  const [ notes, setNotes ] = useState([])
  const [ newNote, setNewNote ] = useState('a new note...')
  const [ showAll, setShowAll ] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  //axios.get() initiates fetching of data from server and registers response's function as an event handler for the operation
  useEffect(() => { 
    noteService.getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, []) //useEffect takes two parameters: The first is a function, the effect itself.
  /*
    The second parameter of useEffect is used to specify how often the effect is run. 
    If the second parameter is an empty array [], 
    then the effect is only run along with the first render of the component.

    useEffect(() => {
      console.log('effect')

      const eventHandler = response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      }

      const promise = axios.get('http://localhost:3001/notes')
      promise.then(eventHandler)
    }, [])
  */

  // console.log('render', notes.length, 'notes')

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
                    //showAll ? notes : notes.filter(note => note.important) is also correct since note.important is either true or false
  
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
    .update(changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }
    
    noteService.create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
    .catch(error => {
      console.log('fail')
    })
   
  }
  
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
    return (    
      <div>
        <h1>Notes</h1> 
        <Notification message={errorMessage} />
        <div>
          <button onClick={() => setShowAll(!showAll)}>
            show {(showAll ? 'important' : 'all')}
          </button>
        </div>
        <ul>
          {/* {console.log('we are in return', notes)}   */}
          {notesToShow.map( note => 
          <Note 
          key={note.id} 
          note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)}
          /> )}
        </ul> 
        <form onSubmit={addNote}>
          <input 
            value={newNote}
            onChange={handleNoteChange} />
          <button type="submit">save</button>
        </form>
        <Footer/>
      </div>
    )   
}

export default Collections 