var router = require('express').Router();
var async = require('async');
var faker = require('faker');

var Category = require('../models/category');
var Product = require('../models/product');

router.post('/search', function(req, res, cb) {
  console.log(req.body.search);
  Product.search({
    query_string: { query: req.body.search }
  }, function(err, results) {
    if (err) return cb(err);
    res.json(results);
  })
})

router.get('/:name', function(req, res, cb) {
  async.waterfall([
    function(result) {
      Category.findOne( {name: req.params.name }, function(err, category)  {
        if (err) return cb(err);
        result(null, category);
      })
    },

    function(category, result) {
      for (var i = 0; i < 30; i++) {
        var product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.img = faker.image.image();

        product.save();
      }
    }
  ]);

  res.json({ msg: 'OK' });
});

module.exports = router;
