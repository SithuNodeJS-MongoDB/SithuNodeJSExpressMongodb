var express = require('express');
var router = express.Router();  

/*Get Home page list */
router.get('/',function(req,res,next){
    res.send('i am from home page');
});

/* Get Details page */
router.get('/details',function(req,res,next){
    res.render('details',{title:'Getting load details page'});
});
module.exports = router;