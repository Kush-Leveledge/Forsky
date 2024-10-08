// models/userModel.js
const pool = require('../db');
const jwt = require('jsonwebtoken');


const getUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  } catch (err) {
    throw err;
  }
};
const postUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (emailCheck.rows.length > 0) {
      // Email already exists
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, role]
    );

    // Return the newly created user
    res.json(newUser.rows[0]);

  } catch (err) {
    // Handle other errors
    res.status(500).send(err.message);
  }
};
const putUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, role } = req.body; // Include role in the destructuring
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE user_id = $4 RETURNING *',
      [name, email, role, user_id] // Include role in the parameters
    );
    if (updatedUser.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(updatedUser.rows[0]); // Respond with the updated user
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const delUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const deletedUser = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [user_id]
    );
    if (deletedUser.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.send(`User with user_id ${user_id} was deleted`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// New login function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userQuery.rows[0];

    // Compare password with stored password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, "forsky", {
      expiresIn: '7d', // Set the token expiration time
    });

    // If valid, return user role and token
    res.status(200).json({ role: user.role, token });
    
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = { getUsers, postUser, putUser, delUser, loginUser };