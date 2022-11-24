import express from 'express';
export const router=express.Router();

import {login,register,checkEmail,checkUsername} from '../controllers/auth.js'

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/checkEmail').post(checkEmail)
router.route('/checkUsername').post(checkUsername)

