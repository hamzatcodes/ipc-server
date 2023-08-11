const BaseApi = require("./baseApi");

class PaystackApi extends BaseApi {
    requestInit = {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    };
    constructor() {
        super(process.env.PAYSTACK_BASE_URL);
    }

    initialize = async (email, amount, callback_url, metaData) => {
        let response = await this.post(
            "/transaction/initialize",
            {
                email,
                amount,
                callback_url,
                metaData,
            },
            undefined,
            this.requestInit
        );

        return response;
    };

    verifyPayment = async (paymentReference) => {
        let response = await this.get(
            `/transaction/verify/${paymentReference}`
        );
        return response;
    };
}

const payStackApi = new PaystackApi();

module.exports = payStackApi;
