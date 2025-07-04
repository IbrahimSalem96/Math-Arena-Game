const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**-------------------------------------------------------------
 * @desc    Register User
 * @route   /auth/register 
 * @method  POST
 * @access  public  
---------------------------------------------------------------*/
async function register(name, username, password) {
  const existing = await User.findOne({ username });
  if (existing) throw new Error("Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, username, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);
  return {
    message: `Hello ${name}, your account is created`,
    access_token: token
  };
}

/**-------------------------------------------------------------
 * @desc    Login User
 * @route   /auth/login
 * @method  POST
 * @access  public
---------------------------------------------------------------*/
async function login(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);
  return {
    message: `Hello ${user.name}, welcome back`,
    access_token: token
  };
}

module.exports = { register, login };
