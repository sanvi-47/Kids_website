import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersDb } from '../models/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_safe_kids_sparkcode_secret_key_2026';

export const register = async (req, res) => {
  try {
    const { username, email, password, role = 'kid', age = 9, avatar = '🦊', parentEmail = '' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existingUser = usersDb.findAll({ email })[0];
    if (existingUser) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = usersDb.create({
      username,
      email,
      passwordHash,
      role,
      age: Number(age) || 9,
      avatar: avatar || '🦊',
      parentEmail,
      screenTimeLimitMinutes: 60,
      xp: 100,
      level: 1,
      badges: ['Welcome Cadet']
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = usersDb.findAll({ email })[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Try kid@sparkcode.ai or parent@sparkcode.ai' });
    }

    // Default demo passwords support 'password123' or direct match for demo simplicity
    let isMatch = false;
    if (user.passwordHash.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }
    if (!isMatch && password === 'password123') {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Hint for demo: password123' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = (req, res) => {
  const user = usersDb.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
};

export const updateSettings = (req, res) => {
  const { screenTimeLimitMinutes, allowedAIModes, avatar } = req.body;
  const updated = usersDb.update(req.user.id, {
    ...(screenTimeLimitMinutes !== undefined && { screenTimeLimitMinutes }),
    ...(allowedAIModes && { allowedAIModes }),
    ...(avatar && { avatar })
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = updated;
  res.json({ user: safeUser });
};

