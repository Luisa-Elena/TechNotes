import React from 'react'
import { useGetNotesQuery } from './notesApiSlice'
import Note from './Note'
import useAuth from '../../hooks/useAuth'

export default function NotesList() {

    const { username, isManager, isAdmin } = useAuth()

    const {
        data: notes, //the data received is renamed as notes
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery('notesList', { //we put a label 'notesList'
        pollingInterval: 15000, //15sec
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if(isLoading) {
        content = <p>Loading...</p>
    }

    if(isError) {
        //console.log(error)
        content = <p>{error?.data?.message}</p>
    }

    if(isSuccess) {
        //console.log(notes)
        const {ids, entities} = notes // destructuring the ids from the data (renamed notes)

        let filteredIds
        if(isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username)
        }

        content = ids?.length
            ? filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)
            : null
    }

    return(
        <div>
            <h1>Notes list</h1>
            {content}
        </div>
    )
}