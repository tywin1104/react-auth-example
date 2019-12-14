const { decode } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decoded_token = decode(token)
    req.user = { _id: decoded_token._id, username:decoded_token.name, email:decoded_token.email, role:decoded_token.role };
    console.log(decoded_token)
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};

