const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,

    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 'Please fill a valid email address']
    },
    thougths: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount')
.get(function() {
    return this.friends.length;
})

const User = model('user', userSchema);

module.exports = User;
