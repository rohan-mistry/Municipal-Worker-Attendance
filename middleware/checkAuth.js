const jwt = require('jsonwebtoken');
const { secrets } = require('../config/secrets');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  //Get the token from the header

  const token = req.header('x-auth-token');

  //Check if not token

  if (!token) {
    return res.status(401).json({ message: 'No token ,authorization denied' });
  }

  const decoded = jwt.verify(token, secrets.auth.signKey);
  const user = await User.findById(decoded.user.id);
  if (!user) {
    return res.status(401).json({ message: 'Unidentified User Request' });
  }
  req.user = user;
  res.locals.user = user;
  next();
};

//Middleware to check if person has access to that route according to the roles assigned
exports.hasRoles = (list) => {
  return function (req, res, next) {
    // List of roles required to access

    const reqdRoles = list;

    // List of roles the user possesses
    // Receiving user roles from the jwt payload

    const acqdRoles = res.locals.user.role;

    console.log(acqdRoles);
    console.log(reqdRoles);
    // Check if user roles are a subset to the list of required roles
    const result = reqdRoles.some((val) => acqdRoles.includes(val));
    console.log(result);
    if (result == false) {
      return res.status(403).json({
        message: 'Access Denied'
      });
    }
    next();
  };
};