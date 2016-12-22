'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactsSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  userId:{type:Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Contacts', ContactsSchema);
