var router = require('express').Router()
var bodyParser = require('body-parser')
router.use(bodyParser.json())
const checksum_lib = require('./checksum')
var today = new Date()
const port = 3000

router.post("/check", function (req, res) {
    if(req.body.payment=="Pay later"){
        res.render("success.ejs");
    }
    else{
        res.redirect("/payment");
    }
});

router.get("/check", function (req, res) {
    res.render("success.ejs");
});

router.get('/payment', (req, res)=>{
    let params ={}
    params['MID'] = 'xQVIdU26063268309668',
    params['WEBSITE'] = 'WEBSTAGING',
    params['CHANNEL_ID'] = 'WEB',
    params['INDUSTRY_TYPE_ID'] = 'Retail',
    params['ORDER_ID'] = 'ORD' + today.getDate() + today.getHours() + today.getMinutes( )+ today.getSeconds(),
    params['CUST_ID'] = 'CUST' + today.getDate() + today.getHours() + today.getMinutes( )+ today.getSeconds(),
    params['TXN_AMOUNT'] = '100',
    params['CALLBACK_URL'] = process.env.PORT+'/check',
    params['EMAIL'] = 'test@gmail.com',
    params['MOBILE_NO'] = '8489797055'

    checksum_lib.genchecksum(params, 'smLH6u8xAWOZ49zp', function(err,checksum){
        let txn_url = 'https://securegw-stage.paytm.in/order/process'
        let form_fields = ""
        for(x in params)
        {
            form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

        }

        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"'/>"

        var html = '<html><body><center><h1>Do not Refresh the page</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
        res.writeHead(200,{
            'Content-Type' : 'text/html'
        }) 
        res.write(html)
        res.end()
    })    
})

module.exports = router
