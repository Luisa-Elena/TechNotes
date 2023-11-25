import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

// we get normalized state with createEntityAdapter({}) 
// ids array and entities object
// the entities cannot be iterated over, but the ids can
//we use the ids to get data from the entities
// with sortComparer we put the completed notes at the bottom
const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
                query: () => ({
                url: '/notes',
                //inside the query we have url and validateStatus
                // validateStatus taken from the documentaion
                // the satus can be 200, but we might still have an error (tricky api)
                // so this is how we should check
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => { //responseData = the response from the query
                const loadedNotes = responseData.map(note => {
                    // the ids array is looking for an id property, not _id
                    note.id = note._id // _id from mongoDB
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes) // now the data is stored as normalized
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) { // in some error cases we might not have the ids array
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
        }),
        addNewNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
        }),
        updateNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `/notes`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
    }),
})

// automatically generated hooks
export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = notesApiSlice

// returns the query result object
// .select() is a creates a selector for the specified endpoint
// This selector will retrieve the result of the getNotes endpoint when called.
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
//Memoized selectors are selectors that only recompute their value when their input selectors change, which can help optimize performance
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)