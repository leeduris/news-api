const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');

const { logInSchema, signUpSchema } = require('../middleware/celebrateSchema/logInSchema')
const users = require('./users/');
const { auth } = require('../middleware/auth/auth');

// @route   GET
router.get('/api/users', auth, users.getUsers)
router.get('/api/users/:id', auth, users.getUser)
router.get('/api/users/auth/logout', auth, users.logOut)

// @route   POST
router.post('/api/users/auth/login', celebrate(logInSchema), users.logIn)
router.post('/api/users/auth/signup', celebrate(signUpSchema), users.signUp)
router.post('/api/users/auth/signup/checkemail', users.checkEmailExist)
router.post('/api/users/auth/refresh', users.resetAccessToken)

// @route   PUT
router.put('/api/users/:id', auth, users.updateUser)

// @route   DELETE
router.delete('/api/users/:id', auth, users.deleteUser)

module.exports = router
