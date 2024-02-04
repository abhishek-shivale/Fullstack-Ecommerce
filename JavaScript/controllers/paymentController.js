import asyncErrorHandler from '../middlewares/asyncErrorHandler.js'
import paytm from 'paytmchecksum'
import https from 'https'
import { payemntModel } from '../models/paymentModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import {v4 as uuidv4} from 'uuid'
import { ErrorMsg } from '../utils/customLog.js'


export const processPayment = asyncErrorHandler(async(req,res,next)=>{
    const {amount, email, phoneNo} = req.body;
    var params = {};
    params["MID"] = process.env.PAYTM_MID
    params['WEBSITE'] = process.env.PAYTM_WEBSITE
    params['CHANNEL_ID']=process.env.PAYTM_CHANNEL_ID
    params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE;
    params["ORDER_ID"] = "oid" + uuidv4();
    params["CUST_ID"] = process.env.PAYTM_CUST_ID;
    params["TXN_AMOUNT"] = JSON.stringify(amount);
    params["CALLBACK_URL"] = `https://${req.get("host")}/api/v1/callback`
    params['EMAIL'] = email;
    params["MOBILE_NO"] = phoneNo;

    let paymentChecksum = payemntModel.generateSignature(params, process.env.PAYTM_MERCHANT_KEY)
    paymentChecksum.then(function(checksum){
        let paytmParams = {
            ...params,
            "CHECKSUMHASH": checksum,
        }
        res.status(200).json({
            paytmParams
        })
    }).catch(function(error){
        ErrorMsg(error)
    })
})
export const paytmResponse = (req,res,next)=>{
    let paymentChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;
    let isVerifySignature = paytm.verifySignature(req.body, process.env.PAYTM_MERCHANT_KEY, paymentChecksum)
    if(isVerifySignature){
        var paytmParams = {};
        paytmParams.body = {
            "mid": req.body.MID,
            "orderId": req.body.ORDERID
        }
        paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY)
        paytmParams.head={
            "signature": checksum
        }
        var post_data = JSON.stringify(paytmParams);
        var options = {
            //for stagging only
            hostname: 'securegw-stage.paytm.in',
            //for production hostname: 'securegw.paytm.in'
            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        }
        var response = '';
        var post_req = https.request(options, function(post_res){
            post_res.on('data', function(chunk){
                response += chunk;
            } )
            post_res.on('end',function(){
                let { body} = JSON.parse(response)
                addPayment(body)
                res.redirect(`httpss://${req.get("host")}/order/${body.orderId}`)
            })
            post_req.write(post_data)
            post_req.end()
        })

    }else {
        ErrorMsg("Checksum Mismatched");
    }
}
const addPayment = async (data) => {
    try {
        await Payment.create(data);
    } catch (error) {
        ErrorMsg("Payment Failed!");
    }
}

export const getPaymentStatus = asyncErrorHandler(async(req,res,next)=>{
    const payment = await payemntModel.findOne({ orderId: req.params.id})
    if(!payment){
        return next(new ErrorHandler("Payment Details Not FOund", 404))
    }
    const txn = {
        id: payment.txnId,
        status: payment.resultInfo.resultStatus
    }
    res.status(200).json({
        success: true,
        txn
    })
})
