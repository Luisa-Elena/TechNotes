const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler') //with this we can avoid so many try-catch blocks
const bcrypt = require('bcrypt')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean() //get the data like json, without password
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // validation
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'This username is already taken' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const newUser = { username, "password": hashedPwd, roles }
    const user = await User.create(newUser)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // validation 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const foundUser = await User.findById(id).exec()
    if (!foundUser) {
        return res.status(400).json({ message: 'User not found' })
    }

    // check if the new username is already taken
    const duplicateUsername = await User.findOne({ username }).lean().exec()
    if(duplicateUsername && duplicateUsername?._id.toString() !== id) {
        return res.status(409).json({ message: 'This username is already taken' })
    }

    foundUser.username = username
    foundUser.roles = roles
    foundUser.active = active

    if (password) { //if we received a new passord (meaning we have to modify the password)
        foundUser.password = await bcrypt.hash(password, 10) 
    }

    const updatedUser = await foundUser.save()

    res.json({ message: `${updatedUser.username} updated` })
})



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // validation
    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    // check if the user still has assigned notes
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const foundUser = await User.findById(id).exec()

    if (!foundUser) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await foundUser.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}