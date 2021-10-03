import { Request, RequestHandler, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config()
const router = Router();
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';
import auth from '../middleware/auth';

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

interface IUserRequest extends Express.Request {
    user: any,
    token: any
}

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.'});
    }
    if (password.length < 3) {
        return res.status(400).json({ msg: 'Password must be atleast 3 characters.'});
    }
    if (username.length < 3) {
        return res.status(400).json({ msg: 'Username must be atleast 3 characters.'});
    }
    if (!email.includes('@')) {
        return res.status(400).json({ msg: 'Enter a valid email address.'})
    }
    try {
        const user = await User.findOne({ email });
        if (user) throw Error('User already exists');

        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('error with bcrypt');

        const hash = await bcrypt.hash(password, salt);
        if(!hash) throw Error('Something went wrong with hashing the password');

        const newUser = new User({
            username,
            email,
            password: hash
        })

        const savedUser = newUser.save();
        if (!savedUser) throw Error('Something went wrong with saving the user to database.');

        const token = jwt.sign({ id: (await savedUser)._id }, JWT_SECRET, {
            expiresIn: 60 * 60
          });

        res.status(201).json({ 
            token,
            user: {
                id: (await savedUser).id,
                username: (await savedUser).username,
                email: (await savedUser).email
            }
        });
    } catch (error) {
        res.status(400).json({msg: error});
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.'});
    }
    try {
        const user = await User.findOne({ email });
        if (!user) throw Error('User does not exist!');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Password match failed.');

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { 
            expiresIn: 60 * 15,
        });
        if (!token) throw Error('Could not sign the token.');

        res.status(200).json({
            token,
            user: { id: user._id , username: user.username, email: user.email },
    })} catch (error: any) {
        res.status(400).json({ msg: error.message });
    }
})

router.get('/', auth as RequestHandler, async (req: any, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        user
    })
})

export default router;

