import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  username: { type: String, unique: true, lowercase: true },
}, {
  toJSON: {
    virtuals: true,
  },
});

// this function is adapted from: https://stackoverflow.com/questions/14588032/mongoose-password-hashing
// and https://mongoosejs.com/docs/middleware.html#pre

// eslint-disable-next-line consistent-return
UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

// this function is adapted from: https://stackoverflow.com/questions/14588032/mongoose-password-hashing
// and: https://stackoverflow.com/questions/40076638/compare-passwords-bcryptjs
UserSchema.methods.comparePassword = function comparePassword(tempPassword, callback) {
  bcryptjs.compare(tempPassword, this.password, (err, res) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
