import React from '../../../notes/node_modules/@types/react'

const Note = ({note, toggleImportance}) => {
    const label = note.important 
    ? 'make not important' 
    : 'make important';

    console.log("note in note function is ", note, note.content)
    return (
        <li className='note'>
            <button onClick={toggleImportance}>{label}</button><br/>
            {note.content}
        </li>
    )   
}

export default Note