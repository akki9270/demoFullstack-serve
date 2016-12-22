'use strict';

var _ = require('lodash');
var Contacts = require('./contacts.model');
var User = require('../user/user.model');

// Get list of contacts
exports.index = function(req, res) {
  Contacts.find(function (err, contacts) {
    contacts =
      [
      {
        "name": "Stafford Carey",
        "email": "staffordcarey@baluba.com",
        "phone": 8853419719
      },
      {
        "name": "Clark Marks",
        "email": "clarkmarks@baluba.com",
        "phone": 7323477663
      },
      {
        "name": "Suzanne Mcclure",
        "email": "suzannemcclure@baluba.com",
        "phone": 8694771166
      },
      {
        "name": "Mavis Acosta",
        "email": "mavisacosta@baluba.com",
        "phone": 9845446837
      },
      {
        "name": "Tessa Morris",
        "email": "tessamorris@baluba.com",
        "phone": 9259273480
      },
      {
        "name": "Virgie Knowles",
        "email": "virgieknowles@baluba.com",
        "phone": 7340581020
      },
      {
        "name": "Evangelina Russell",
        "email": "evangelinarussell@baluba.com",
        "phone": 8420510975
      },
      {
        "name": "Nelson Bowman",
        "email": "nelsonbowman@baluba.com",
        "phone": 8994809093
      },
      {
        "name": "Acosta Randolph",
        "email": "acostarandolph@baluba.com",
        "phone": 9038880802
      },
      {
        "name": "Manuela Wyatt",
        "email": "manuelawyatt@baluba.com",
        "phone": 9858408015
      },
      {
        "name": "Jenna Sheppard",
        "email": "jennasheppard@baluba.com",
        "phone": 7409971005
      },
      {
        "name": "Cara Mosley",
        "email": "caramosley@baluba.com",
        "phone": 7739689713
      },
      {
        "name": "Calderon Meadows",
        "email": "calderonmeadows@baluba.com",
        "phone": 7974728189
      },
      {
        "name": "Ola Ratliff",
        "email": "olaratliff@baluba.com",
        "phone": 9607352865
      },
      {
        "name": "Janet Hinton",
        "email": "janethinton@baluba.com",
        "phone": 8084859019
      }
    ];
    if(err) { return handleError(res, err); }
    return res.status(200).json(contacts);
  });
};

// Get a single contacts
exports.show = function(req, res) {
  console.log('params: ',req.params.id)
  Contacts.findById(req.params.id, function (err, contacts) {
    if(err) { return handleError(res, err); }
    if(!contacts) { return res.status(404).send('Not Found'); }
    return res.json(contacts);
  });
};

// Creates a new contact in the DB.
exports.create = function (req, res) {
  Contacts.create(req.body, function (err, contact) {
    if (err) {
      return handleError(res, err);
    }
    User.findById(contact.userId, function (err, user) {
      if (err) {
        return handleError(res, err);
      }
      if (!user) {
        return res.status(404).send('user not found');
      }
      user.contacts.push(contact);
      var updated = _.merge(user, contact._id);
      updated.save(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(contact);
      });
    });
  });
};


// Updates an existing contacts in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Contacts.findById(req.params.id, function (err, contacts) {
    if (err) { return handleError(res, err); }
    if(!contacts) { return res.status(404).send('Not Found'); }
    var updated = _.merge(contacts, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(contacts);
    });
  });
};

// Deletes a contacts from the DB.
exports.destroy = function(req, res) {
  Contacts.findById(req.params.id, function (err, contacts) {
    if(err) { return handleError(res, err); }
    if(!contacts) { return res.status(404).send('Not Found'); }
    contacts.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
