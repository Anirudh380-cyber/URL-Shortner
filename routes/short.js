const express = require('express');
const router = express.Router();
const date = require('date-and-time');
const User = require('../models/user');
const jwt  = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const md5 = require('md5');
const link_URL = require('../models/link_URL');
const Link = require('../models/link');
const utf8 = require('utf8');
const Userdetails = require('../models/userdetails');

router.post('/shorturl',authenticate,async(req,res) =>{
    const longUrl = utf8.encode(req.body.url);
    const hashMsg = md5(longUrl);
    let text = "";
    const possible = hashMsg;
    let check=""
    do{
        for (let i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        check = link_URL.findOne({_id : text});  
    }
    while(!check);
     const generated = "teeny/"+text;
     //console.log(generated);
     const url = new link_URL({_id : text , URL : longUrl});
     //console.log(url);
     await url.save();
     //console.log(res.locals.currUser._id);
     const cUser = await Userdetails.findOne({author : res.locals.currUser._id});
     console.log(cUser._id);
     const now = new Date();
     date.format(now, 'YYYY/MM/DD HH:mm:ss');
     let expiry = date.addYears(now, 2);
     date.format(expiry, 'YYYY/MM/DD HH:mm:ss');
     const urldata = new Link({_id : text , URL : longUrl , email:res.locals.currUser.email , create_date : now , expiry_date : expiry});
     await urldata.save();
     urldata._id=generated;
     cUser.Links.push(urldata);
     await cUser.save();
     res.render('short_url',{urldata});
})
router.get('/teeny/:code', async (req, res) => {
    try {
        const url = await link_URL.findOne({
            _id : req.params.code
        })
        if (url) {
            return res.redirect(url.URL);
        } else {
            return res.status(404).json('No URL Found')
        }

    }
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
})

module.exports = router;







