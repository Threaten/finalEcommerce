var router = require('express').Router();
var Category = require('../models/category');

router.get('/addCategory', function(req, res, cb) {
  res.render('admin/addCategory', { msg: req.flash('OK')});
});

router.post('/addCategory', function(req, res, cb) {
  var category = new Category();
  category.name = req.body.name;

  category.save(function(err) {
    if (err) return cb(err);
    req.flash('OK', 'Category added');
    return res.redirect('/addCategory');
  });
});

module.exports = router;
