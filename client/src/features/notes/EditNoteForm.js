import { useState, useEffect } from "react"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth" //only admins and managers can delete a note

export default function EditNoteForm ({note, users}) {

    const { isManager, isAdmin } = useAuth()

    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [userId, setUserId] = useState(note.user)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onSaveNoteClicked = async (e) => {
        await updateNote({ id: note.id, user: userId, title, text, completed })
    }
    const onDeleteNoteClicked = async (e) => {
        await deleteNote({ id: note.id })
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    let deleteButton = null
    if(isManager || isAdmin) {
        deleteButton = (
        <button 
            onClick={onDeleteNoteClicked}
        >
            Delete note
        </button>
    )}

    return (
        <div>
            <h1>Edit note form page</h1>

            <label>
                Title:
                <input 
                    type='text'
                    value={title}
                    onChange={onTitleChanged}
                />
            </label>
            <br />
            <label>
                Text:
                <textarea 
                    value={text}
                    onChange={onTextChanged}
                />
            </label>
            <br />
            <label>
                <input 
                    type='checkbox'
                    checked={completed}
                    onChange={onCompletedChanged}
                />
                completed
            </label>
            <br />
            <label>
                Assigned to:
                <select 
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>
            </label>

            <p>Created: {created}</p>
            <p>Updated: {updated}</p>

            <button onClick={onSaveNoteClicked} >Save</button>
            {deleteButton}
        </div>

    )
}