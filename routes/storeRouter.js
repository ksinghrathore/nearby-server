var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify    = require('./verify');
var Stores = require('../models/stores');

var storeRouter = express.Router();
storeRouter.use(bodyParser.json());

storeRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Stores.find({}, function (err, store) {
        if (err) throw err;
        res.json(store);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Stores.create(req.body, function (err, store) {
        if (err) throw err;
        console.log('Store Added!');
        var id = store._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Store with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Stores.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

storeRouter.route('/:storeId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Stores.findById(req.params.storeId, function (err, store) {
        if (err) throw err;
        res.json(store);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Stores.findByIdAndUpdate(req.params.storeId, {
        $set: req.body
    }, {
        new: true
    }, function (err, store) {
        if (err) throw err;
        res.json(store);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Stores.findByIdAndRemove(req.params.storeId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});
module.exports = storeRouter;
