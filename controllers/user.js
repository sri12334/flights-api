import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';


const userControllers = {
    register: async (req, res) => {
        const { email, password, rePassword } = req.body;

        const emailExist = User.getByEmail(email);
        if (emailExist) {
            return res.status(409).render('404', {
                title: 'Email already exist',
                message: 'Email already exist'
            });
        }
        const isValidEmail = validateEmail(email);
        const isValidPassword = validatePassword(password);
        const doPasswordMatch = matchPasswords(password, rePassword);

        if (isValidEmail && isValidPassword && doPasswordMatch) {
            try {
                // Hash the password asynchronously
                const hashedPassword = await hashPassword(password);
                
                // Add the new user
                const newUser = User.add({
                    email,
                    password: hashedPassword
                });

                // Redirect to login page after successful registration
                return res.status(302).redirect('/api/login');
            } catch (error) {
                console.error(error);
                return res.status(500).render('404', {
                    title: 'Server error',
                    message: 'An error occurred during registration'
                });
            }
        } else {
            return res.status(400).render('404', {
                title: 'Invalid email or password',
                message: 'Invalid email or password'
            });
        }
    },
    
    login: (req, res) => {
        const {email, password} = req.body;
        const emailExist = User.getByEmail(email);
        if(!emailExist) {
            return res.status(400).render('404', {
                title: 'Email does not exist',
                message: 'Email does not exist, please register'
            });
        }
        //check if password matches
        bcrypt.compare(password, emailExist.password, (err, valid) => {
            if (err) {
                console.log(err);
            }
            if (!valid) {
                return res.status(400).render('404', {
                    title: 'Invalid email or password',
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign({email}, process.env.TOKEN_SECRET);

            res.cookie('token', token, {httpOnly: true});
            res.status(302).redirect('/api/flights');
        });

    },
    logout: (req, res) => {
        res.clearCookie('token');
        res.status(302).redirect('/api/flights')
    },
    getRegisterForm: (req, res) => {
        res.status(200).render('register-form')
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form')
    },
    
}

export default userControllers;
