var Cart = require('../models/cart');

module.exports = function(req, res, cb) {
  if (req.user) {
    var total = 0;
    Cart.findOne({ owner: req.user._id}, function(err, cart) {
      if (cart) {
        for (var i = 0; i < cart.items.length; i++) {
          total += cart.items[i].quantity;
        }
        res.locals.cart = total;
      } else {
        res.locals.cart = 0;
      }
      cb();
    })
  } else {
    cb();
  }
}
