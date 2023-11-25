const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler') //with this we can avoid so many try-catch blocks

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }
    
    // find the user for each note and send back the username with each note
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    //validation
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'This note title already exists' })
    }

    // Create and store the new note 
    const note = await Note.create({ user, title, text })

    if (note) {
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // validation 
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundNote = await Note.findById(id).exec()
    if (!foundNote) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // check if the new note title is already taken
    const duplicateNoteTitle = await Note.findOne({ title }).lean().exec()
    if(duplicateNoteTitle && duplicateNoteTitle?._id.toString() !== id) {
        return res.status(409).json({ message: 'This note title is already taken' })
    }

    foundNote.user = user
    foundNote.title = title
    foundNote.text = text
    foundNote.completed = completed

    const updatedNote = await foundNote.save()

    res.json({ message: `${updatedNote.title} updated` })
})




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // validation
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // check if the note exists
    const foundNote = await Note.findById(id).exec()
    if (!foundNote) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await foundNote.deleteOne()

    const reply = `Note ${result.title} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}