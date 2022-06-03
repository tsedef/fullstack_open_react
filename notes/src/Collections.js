import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

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
  // const [ newNote, setNewNote ] = useState('a new note...') now handled in NoteForm state
  const [ showAll, setShowAll ] = useState(true)
  const [ errorMessage, setErrorMessage ] = useState('some error happened...')
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)

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

  //Checks if user details of a logged-in user can already be found on local storage. If they can, details are saved to the state of app and to noteService.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []) //empty array paramater of effect ensures this effect is executed only when component is rendered for first time.

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      /*
        Values saved to storage are DOMstrings. Object has to be parsed to JSON first. -> AND when an object is read
        from local storage, it has to be parsed back to JS with JSON.parse!

        The details of a logged-in user are now saved to the local storage,
        and they can be viewed on the console (by typing window.localStorage to the console):
      */
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      loginFormRef.current.toggleVisibility() //utilizes Togglable's funtion using ref object
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginFormRef = useRef()
  const loginForm = () => (
    <Togglable buttonLabel='login' ref={loginFormRef}>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  //showAll ? notes : notes.filter(note => note.important) is also correct since note.important is either true or false

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()  //ref.current gives access to ref's shared functions
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
      .catch(error => {
        console.log(error, 'fail')
      })
  }

  const noteFormRef = useRef() //mutable reference object to component. ensures same ref is kept throughout re-renders
  const noteForm = () => (
    <Togglable buttonLabel='add a new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {/*conditionally rendering LoginForm if users's logged in*/}
      {loginForm()}
      {noteForm()}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
            show {(showAll ? 'important' : 'all')}
        </button>
      </div>

      <ul>
        {notesToShow.map( note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          /> )}
      </ul>
      <Footer/>
    </div>
  )
}

export default Collections