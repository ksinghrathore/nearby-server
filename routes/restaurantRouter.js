var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify    = require('./verify');
var Restaurants = require('../models/restaurants');

var restaurantRouter = express.Router();
restaurantRouter.use(bodyParser.json());

restaurantRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Restaurants.find({})
      .populate('reviews.postedBy')
        .exec(function (err, resta) {
        if (err) throw err;
        res.json(resta);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Restaurants.create(req.body, function (err, resta) {
        if (err) throw err;
        console.log('Restaurant created!');
        var id = resta._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Restaurant with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Restaurants.remove({}, function (err, resta) {
        if (err) throw err;
        res.json(resta);
    });
});

restaurantRouter.route('/:restaId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Restaurants.findById(req.params.restaId)
    .populate('reviews.postedBy')
      .exec(function (err, resta) {
        if (err) throw err;
        res.json(resta);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Restaurants.findByIdAndUpdate(req.params.restaId, {
        $set: req.body
    }, {
        new: true
    }, function (err, resta) {
        if (err) throw err;
        res.json(resta);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Restaurants.findByIdAndRemove(req.params.restaId, function (err, resta) {        if (err) throw err;
        res.json(resta);
    });
});

restaurantRouter.route('/:restaId/reviews')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Restaurants.findById(req.params.restaId)
    .populate('reviews.postedBy')
      .exec(function (err, resta) {
        if (err) throw err;
        res.json(resta.reviews);
    });
})

.post(function (req, res, next) {
    Restaurants.findById(req.params.restaId, function (err, resta) {
        if (err) throw err;
        req.body.postedBy = req.decoded._doc._id;
        resta.reviews.push(req.body);
        resta.save(function (err, resp) {
            if (err) throw err;
            console.log('Updated review!');
            res.json(resp);
        });
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Restaurants.findById(req.params.restaId, function (err, resta) {
        if (err) throw err;
        for (var i = (resta.reviews.length - 1); i >= 0; i--) {
            resta.reviews.id(resta.reviews[i]._id).remove();
        }
        resta.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all reviews!');
        });
    });
});

restaurantRouter.route('/:restaId/reviews/:reviewId')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Restaurants.findById(req.params.restaId)
    .populate('reviews.postedBy')
      .exec(function (err, resta) {
        if (err) throw err;
        res.json(resta.reviews.id(req.params.reviewId));
    });
})

.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Restaurants.findById(req.params.restaId, function (err, resta) {
        if (err) throw err;
        resta.reviews.id(req.params.reviewId).remove();
         req.body.postedBy = req.decoded._doc._id;
        resta.reviews.push(req.body);
        resta.save(function (err, resp) {
            if (err) throw err;
            console.log('Updated review!');
            res.json(resp);
        });
    });
})

.delete(function (req, res, next) {
    Restaurants.findById(req.params.restaId, function (err, resta) {
      if (resta.reviews.id(req.params.reviewId).postedBy != req.decoded._doc._id) {
           var err = new Error('You are not authorized to perform this operation!');
           err.status = 403;
           return next(err);
       }
        resta.reviews.id(req.params.reviewId).remove();
        resta.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = restaurantRouter;
