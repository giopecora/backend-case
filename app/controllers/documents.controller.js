const db = require("../models");
const repository = require("../repositories/document.repository.js");

const fs = require('fs');

exports.create = (req, res) => {
  repository.create(req).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message
    });
  });
};

exports.findAll = (req, res) => {
  repository.findAll(req).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message
    });
  });
};

exports.getContent = (req, res) => {
  repository.findOne(req).then(data => {
    if (!data){
      res.status(404).send({ message: "Not found document with id " + id });
    }
    var contents = fs.readFileSync(data.filePath).toString();
    
    res.send(contents);
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving document with id=" + id });
  });
};

exports.findOne = (req, res) => {
  repository.findOne(req).then(data => {
    if (!data){
      res.status(404).send({ message: "Not found document with id " + id });
    }
    res.send(data);
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving document with id=" + id });
  });
};

exports.update = (req, res) => {

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  repository.update(req).then(data => {
    if (!data) {
      return res.status(404).send({
        message: `Cannot update Document with id=${id}.`
      });
    }  
    return res.send({ message: "Document was updated successfully." });
  })
  .catch(err => {
    console.log(err);
    return res.status(500).send({
      message: "Error updating Document with id=" + id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  repository.delete(req).then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Document with id=${id}.`
        });
      } else {
        res.send({
          message: "Document was deleted successfully!"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Could not delete Document with id=" + id
      });
    });
};
