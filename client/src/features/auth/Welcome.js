import React from 'react'
import {Link} from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Welcome() {

    const { username, isManager, isAdmin } = useAuth()

    return(
        <div>
            <h1>Welcome, {username}!</h1>
            {/* only managers and admins are allowed to view user settings or add a new user*/}
            
            <p><Link to="/dash/notes">View techNotes</Link></p>
            
            <p><Link to="/dash/notes/new">Add new techNote</Link></p>

            { (isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            { (isManager || isAdmin) && <p><Link to="/dash/users/new">Add new user</Link></p>}
        </div>
    )
}