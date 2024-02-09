var path = require('path');
const db = require("../models");
const Document = db.Document;

const fs = require('fs');

exports.create = (req) => {
    const document = new Document({
        filePath: req.file.path,
        description: req.body.description,
        extension: path.extname(req.file.originalname).replace(".", ""),
        fileName: req.file.originalname,
        category: req.body.category  ? req.body.category : "default"
    });
    
      return document
        .save(document)
};

exports.findAll = (req) => {
    const search = req.query.search;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const category = req.query.category;

    const condition = search
        ? {
            $or: [
            { fileName: { $regex: new RegExp(search), $options: 'i' } },
            { description: { $regex: new RegExp(search), $options: 'i' } },
            { extension: { $regex: new RegExp(search), $options: 'i' } },
            ],
        }
        : {};

    if (startDate && endDate) {
        condition.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (category) {
        condition.category = category;
    }

    return Document.find(condition);
};
  
exports.findOne = (req) => {
    const id = req.params.id;
    return Document.findById(id);
};

exports.update = async (req) => {
    const id = req.params.id;
    const currentDocument = await Document.findById(id);

    if (!currentDocument) {
        throw new Error('Documento não encontrado');
    }

    let params = req.body;

    const historyEntry = {
        filePath: currentDocument.filePath,
        fileName: currentDocument.fileName,
        description: currentDocument.description,
        extension: currentDocument.extension,
        category: currentDocument.category,
        deletedAt: currentDocument.deletedAt,
        createdAt: currentDocument.createdAt,
        updatedAt: currentDocument.updatedAt
    };
    
    currentDocument.history.push(historyEntry);

    params.history = currentDocument.history;

    const updatedDocument = await Document.findByIdAndUpdate(id, params, { useFindAndModify: false, new: true });

    return await updatedDocument.save();
};

exports.delete = async (req) => {
    const id = req.params.id;
    const currentDate = new Date();
    document = await Document.findById(id)
    fs.unlinkSync(document.filePath);
    return Document.findByIdAndUpdate(id, {deletedAt: currentDate}, { useFindAndModify: false })
};