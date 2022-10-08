// Email

// OTP

export const GenerateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

// Notification from Twilio
export const onRequestOTP = async (otp: number, toPhoneNumber: string, to?:string) => {
  const accountSid = 'ACd739c150f75259b22959ab920c5c6c45';
  const authToken = 'b6931310367778f9ec9c66bc4dddb8f4';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+2348084532602',
    to: `+234${toPhoneNumber}`,
  });

  return response;
};

// Payment
// 08084532602