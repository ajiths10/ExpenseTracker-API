const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.PostPayment = async(req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: 50000, // amount in smallest currency unit
            currency: "INR",
            receipt: '',
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.PostPaymentSuccess = async(req, res, next) =>{
  
        try {
            // getting the details back from our font-end
            const {
                orderCreationId,
                razorpayPaymentId,
                razorpayOrderId,
                razorpaySignature,
            } = req.body;
    
            // Creating our own digest
            // The format should be like this:
            // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId,  process.env.RAZORPAY_KEY_SECRET);
            const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    
            shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    
            const digest = shasum.digest("hex");
    
            // comaparing our digest with the actual signature
            if (digest !== razorpaySignature)
                return res.status(400).json({ msg: "Transaction not legit!" });
    
            // THE PAYMENT IS LEGIT & VERIFIED
            // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
            
            req.user.update({isPreminum : true} )

            res.json({
                msg: "success",
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
   
}