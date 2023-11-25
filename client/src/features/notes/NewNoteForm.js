import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewNoteMutation } from "./notesApiSlice"

export default function NewNoteForm ({users}) {
    
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()
            await addNewNote({ user: userId, title, text })
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    return (
        <div>
            <h1>New note form page</h1>

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
                Assigned to:
                <select 
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>
            </label>
            <br />
            <button onClick={onSaveNoteClicked} >Save</button>

        </div>
    )

}