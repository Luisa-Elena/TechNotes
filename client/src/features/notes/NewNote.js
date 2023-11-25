import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

export default function NewNote () {
    const users = useSelector(selectAllUsers)
    // users is an array from the memoized query

    if(!users?.length) return <p>Currently not available</p>

    const content = <NewNoteForm users={users} />

    return content
}