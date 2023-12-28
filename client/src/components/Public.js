import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Public() {

    return(
        <div className='public-component'>
            <h1>TechNotes</h1>
            <h2>About</h2>
            <p> 
                This website is actually like an employee management system for a small tech repair shop business, used to keep track of the tasks for each employee.
                This project also implements role based permissions. Each user can be either an Admin, Manager or Employee. An employee can only view and edit its assigned notes. Anyone can create a note (when a customer checks-in) which will be assigned to a specific employee. Notes can only be deleted by managers or admins. They can view, edit and delete all notes and only they can acces user setings and even add new users (create new accounts).
            </p>
            <h2>Contact</h2>
            <p>put some contact data here - address, phone number, email for the repair shop</p>
            <h2>Login</h2>
            <Link to="/login" className='login-link'>Employee Login</Link>
        </div>
    )
}