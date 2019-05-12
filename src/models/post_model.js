import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const PostSchema = new Schema({
  title: String,
  tags: [String],
  content: String,
  cover_url: String,
  comments: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' }, // author is user id
  username: String, // username is author's chosen screen name
}, {
  toJSON: {
    virtuals: true,
  },
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
