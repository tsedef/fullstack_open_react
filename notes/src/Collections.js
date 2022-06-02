import React, { useState, useEffect, Fragment } from "react"
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from "./components/Notification"
import loginService from "./services/login"

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
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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
        'loggedNoteappUser', JSON.stringify(user)
      )
    
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
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
      important: Math.random() > 0.5,
      id: notes.length + 1,
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

        {/*conditionally rendering loginform/addNote form if users's logged in*/}

        {user === null ?  
         loginForm() :
         <div>
           <p>{user.name} logged-in</p>
           <button onClick={() => {
             window.localStorage.clear()
             window.location.reload()
           }}>Logout</button>
           {noteForm()}
         </div>} 

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