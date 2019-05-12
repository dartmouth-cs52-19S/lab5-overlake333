import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const { email, password, username } = req.body;

  // status 422 adapted from https://httpstatuses.com/422
  if (!email || !password || !username) {
    return res.status(422).send('Please provide your username, email, and password');
  }

  User.findOne({ email })
    .then((data) => {
      if (data == null) { // if there is no user with new email, data will be null
        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;
        user.save()
          .then((response) => {
            res.send({ token: tokenForUser(user) });
          })
          .catch((err) => {
            if (err) {
              res.sendStatus(500);
            }
          });
      } else {
        res.status(422).send('An account was already created with this email.');
      }
    })
    .catch((err) => {
      res.sendStatus(500);
    });

  return next;
};
