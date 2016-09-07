var router = require('express').Router();

var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');

Product.createMapping(function(err, mapping) {
  if (err) {
    console.log(err);
  } else {
    console.log("OK");
    console.log(mapping);
  }
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function() {
  count++;
});

stream.on('close', function() {
  console.log("Indexed " + count + " documents");
});

stream.on('error', function(err) {
  console.log(err);
});

router.post('/search', function(req, res, cb) {
  res.redirect('/search?query=' + req.body.query);
});

router.get('/search', function(req, res, cb) {
  if (req.query.query) {
    Product.search({
      query_string: {query: req.query.query}
    }, function(err, results) {
      if (err) return cb(err);
      var data = results.hits.hits.map(function(hit) {
        return hit;
      });
      res.render('main/results', {
        query: req.query.query,
        data: data
      });
    });
  }
});

function pagination(req, res, cb) {
  var perPage = 9;
  var page = req.params.page;
  Product
  .find()
  .skip(perPage * page)
  .limit(perPage)
  .populate('category')
  .exec(function(err, products) {
    if (err) return cb(err);
    Product.count().exec(function(err, count) {
      if (err) return cb(err);
      res.render('main/index', {
        products: products,
        pages: count/perPage
      });
    });
  });
}

router.get('/', function(req, res, cb) {
  pagination(req, res, cb);
});

router.get('/page/:page', function(req, res, cb) {
  pagination(req, res, cb);
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/products/:id', function(req, res, cb) {
  Product
  .find({ category: req.params.id })
  .populate('category')
  .exec(function(err, products) {
    if (err) return cb(err);
    res.render('main/category', {
      products: products,
    });
  });
});

router.get('/product/:id', function(req, res, cb) {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return cb(err);
    res.render('main/product', {
      product: product
    });
  });
});

router.post('/product/:productId', function(req, res, cb) {
  Cart.findOne({ owner: req.user._id }, function(err, cart) {
    cart.items.push({
      item: req.body.productId,
      price: parseFloat(req.body.priceTotal),
      quantity: parseInt(req.body.quantity)
    });
    cart.total = (cart.total + parseFloat(req.body.priceTotal)).toFixed(2);
    cart.save(function (err) {
      if (err) return cb(err);
      return res.redirect('/cart');
    });
  });
});

router.get('/cart', function(req, res, cb) {
  Cart
  .findOne({ owner: req.user._id })
  .populate('items.item')
  .exec(function(err, userCart) {
    if (err) return cb(err);
    res.render('main/cart', {
      userCart: userCart
    });
  });
});

module.exports = router;
