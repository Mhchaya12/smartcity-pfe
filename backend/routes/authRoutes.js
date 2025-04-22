import { Router } from 'express';
const router = Router();
import { compare, hash } from 'bcrypt';
import  sign  from 'jsonwebtoken';
import findOne  from '../models/userModel.js';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await hash(password, 10);
    const user = new User({
      id: `u${require('uuid').v4().slice(0, 3)}`,
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;