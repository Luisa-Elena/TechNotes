import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// this component is initiating the state for redux to make sure the notes and users queries have the data
// we can refresh the page and the data will be grabbed again quickly 
const Prefetch = () => {
    useEffect(() => {
        //console.log('subscribing')

        //we create a manual subscription with initiate() to the queries for notes and for users that will remain active
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            //console.log('unsubscribing')
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch