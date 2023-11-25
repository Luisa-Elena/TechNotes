import {useNavigate} from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectNoteById } from './notesApiSlice'

export default function Note({noteId}) {

    const navigate = useNavigate()
    const note = useSelector(state => selectNoteById(state, noteId))

    function handleEdit() {
        navigate(`/dash/notes/${noteId}`)
    }

    let created
    let updated
    if(note) {
        created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
    }

    return (
        note && <div>
            <h2>{note.username}</h2>
            <p>{note.title}</p>
            <p>{note.text}</p>
            {note.completed ? <p>completed</p> : <p>not completed</p>}                    
            <p>Created at {created}</p>
            <p>Updated at {updated}</p>
            <button
                onClick={handleEdit}
            >
                Edit note
            </button>
        </div>
    )
}