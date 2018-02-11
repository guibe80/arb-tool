var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Arbitrage tool', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
  req.session.success = null;
});

router.post('/submit', function(req, res, next){
  debugger;
  req.check('email', 'Invalid email address').isEmail();
  req.check('password', 'Passwords must be at least 5 chars long and contain one number').isLength({min:5}).matches(/\d/).equals(req.body.confirmpassword);

  var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
  }
  else{
    req.session.success = true;
  };
  res.redirect('/');
})

router.get('/arbitrage', function(req, res, next){
  res.render('arbitrage')
})

module.exports = router;
