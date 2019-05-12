import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import UserModel from '../models/user_model';

// for secret key
dotenv.config({ silent: true });

// const localOptions = { usernameField: 'email' };

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};

const loginJWT = new JwtStrategy(jwtOptions, (payload, done) => {
  UserModel.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

const loginLocal = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  // eslint-disable-next-line
  UserModel.findOne({ email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  });
});

passport.use(loginJWT);
passport.use(loginLocal);


export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
