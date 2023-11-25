import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

// we get normalized state with createEntityAdapter({}) 
// ids array and entities object
// the entities cannot be iterated over, but the ids can
//we use the ids to get data from the entities
const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                //inside the query we have url and validateStatus
                // validateStatus taken from the documentaion
                // the satus can be 200, but we might still have an error (tricky api)
                // so this is how we should check
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // keepUnusedDataFor --> whether the data is refered in the cache, or we need to request new data
            // 5sec is only for development, the default is 60sec (the default value is needed in deployment)
            // after all the subscriptions are gone, the countdown starts
            //keepUnusedDataFor: 5,

            transformResponse: responseData => { //responseData = the response from the query
                const loadedUsers = responseData.map(user => {
                    // the ids array is looking for an id property, not _id
                    user.id = user._id // _id from mongoDB
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers) // now the data is stored as normalized
            },

            providesTags: (result, error, arg) => {
                if (result?.ids) { // in some error cases we might not have the ids array
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            // with invalidatesTags we force the cache to update
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
})

// automatically generated hooks
export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice

// returns the query result object
// .select() is a creates a selector for the specified endpoint
// This selector will retrieve the result of the getUsers endpoint when called.
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
//Memoized selectors are selectors that only recompute their value when their input selectors change, which can help optimize performance
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)