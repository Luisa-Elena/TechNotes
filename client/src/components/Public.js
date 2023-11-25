import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Public() {

    return(
        <div className='public-component'>
            <h1>TechNotes</h1>
            <h2>About</h2>
            <p> 
                Replace current sticky note system
                Add a public facing page with basic contact info
                Add an employee login to the notes app
                Provide a welcome page after login
                Provide easy navigation
                Display current user and assigned role
                Provide a logout option
                Require users to login at least once per week
                Provide a way to remove employee access asap if needed
                Notes are assigned to specific employees
                Notes have a ticket #, title, note body, created & updated dates
                Notes are either OPEN or COMPLETED
                Users can be Employees, Managers, or Admins
                Notes can only be deleted by Managers or Admins
                Anyone can create a note (when customer checks-in)
                Employees can only view and edit their assigned notes
                Managers and Admins can view, edit, and delete all notes
                Only Managers and Admins can access User Settings
                Only Managers and Admins can create new users
                Desktop mode is most important but should be available in mobile
            </p>
            <h2>Contact</h2>
            <p>put some contact data here - address, phone number, email</p>
            <h2>Login</h2>
            <Link to="/login" className='login-link'>Employee Login</Link>
        </div>
    )
}