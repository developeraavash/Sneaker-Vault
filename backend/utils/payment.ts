import crypto from "crypto";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
function createSignature(data: string) {
  const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "";
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest();
  return signature.toString('base64');
}


function createOrderSessionId({
  orderId,
  userId,
}: {
  orderId: number;
  userId: number;
  email: string;
  totalAmount: number;
}) {
    const id = uuidv4()
    return `${orderId}-${id}-${userId}`
}

export async function esewaPayment(
  payload: {
    amount: number;
    deliveryFee: number;
    taxFee: number;
    serviceCharge: number;
  },
  metaData: { userId: number; orderId: number; email: string },
) {
  try {
    const transactionUUID = uuidv4().split("-")[0];
    const totalAmount = Object.values(payload).reduce((a, b) => {
      return a + b;
      }, 0);
      const data = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=EPAYTEST`;
      const sessionId = createOrderSessionId({ totalAmount, ...metaData });
      const signature = createSignature(data);
    return {
      signature,
      amount: payload.amount,
      failure_url: "https://localhost:3000",
      product_delivery_charge: payload.deliveryFee.toString(),
      product_service_charge: payload.serviceCharge.toString(),
      product_code: "EPAYTEST",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `http://localhost:3000/order-confirm/${sessionId}`,
      tax_amount: payload.taxFee.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUUID,
    };
  } catch (err) {
    console.error("Error esewa", err);
  }
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
export async function khaltiPayment(metaData: {
  orderId: number;
  userId: number;
  email: string;
  totalAmount: number;
}) {
  try {
    const sessionId = createOrderSessionId({ ...metaData });
    const paymentResponse = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `key live_secret_key_68791341fdd94846a146f0457ff7b455`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `http://localhost:3000/`,
          website_url: "http://localhost:3000",
          amount: "10000",
          purchase_order_id: "test12",
          purchase_order_name: "test",
          customer_info: {
            name: "ram bahadur",
            email: "test@khalti.com",
            phone: "9800000000",
          },
        }),
      },
    );
    if (paymentResponse.ok) {
      const { payment_url: paymentUrl } = await paymentResponse.json();
      return paymentUrl;
    }
    return "";
  } catch (err) {
    console.error("Error creating khalti payment", err);
  }
}
