import express from 'express';
export const router=express.Router();

import {login,register,checkEmail,checkUsername,updateAvatar,deleteUser,changePassword} from '../controllers/auth.js'

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/checkEmail').post(checkEmail)
router.route('/checkUsername').post(checkUsername)
router.route('/updateAvatar').post(updateAvatar)
router.route('/deleteUser').delete(deleteUser)
router.route('/changePassword').put(changePassword)

