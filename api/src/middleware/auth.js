const config = require("../config/config");
const jwt = require("express-jwt");

function authorize(roles = []) {
  if (typeof roles === 'string') {
      roles = [roles];
  }
  return [
      jwt({ secret: config.secret, algorithms: ['HS256'] }),
      (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(401).json({status:"error", message: 'Unauthorized access'});
        }
        next();
      }
  ];
}

module.exports = authorize;
