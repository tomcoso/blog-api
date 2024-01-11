const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const Admin = require("../models/admins");

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET_JWT_KEY;

module.exports = new JwtStrategy(options, async (jwt_payload, done) => {
  const user = await Admin.find({ email: jwt_payload.email });
  if (!user) {
    return done(null, false);
  }
  return done(null, true);
});
