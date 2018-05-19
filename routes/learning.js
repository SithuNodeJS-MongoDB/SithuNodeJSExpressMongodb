var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    res.render('addDetails');
});

/* To submit the current form details to DB */
router.post('/addFormDetails',function(req,res,next){
    console.log("i am in /addFormDetails");
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var newUrl = req.body.learningurl;
    var newTitle = req.body.learningtitle;
    var newComment = req.body.learningcomment;
    console.log("req body is : ",req.body);
    var newTechies = [];
    Object.keys(req.body).forEach(function(k) {
        if(k !== "learningurl" && k !== "learningtitle" && k !== "learningcomment") {
            newTechies.push(k);
        }
    });
    console.log("updated json data is : ", newTechies);

    // Set our collection
    var collection = db.get('detailscollection');

    //Submit to DB
    //Checking duplicate entries
    collection.findOne({learningurl:newUrl},function(err,result){
        if(err) throw err;
        if(result === null){
            //Submit the data now
            collection.insert({
                "learningurl" : newUrl,
                "learningtitle" : newTitle,
                "learningcomment": newComment,
                "learningtechies": newTechies
            }, function(err, docs){
                if(err){
                    //If it is failed, return error
                    res.send("There was a problem adding the information to the database");
                }else{
                    console.log("Current doc is : ", docs);
                    //And forward to success page with all data
                    collection.find({}, {}, function (e, docs) {
                        res.render('details', {
                          "detailslist": docs
                        });
                      });
                }
            });
        }else if(result.learningurl === newUrl){
            res.render("duplicate",{"statusMsg":"Current Entering data available in database"});
            db.close();
        }else{
            res.send("Something went to wrong");
            db.close();
        }
    });
});
module.exports = router;