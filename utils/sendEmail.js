const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or use SMTP
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
    
      await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
      });
  } catch (e) {
    console.log("Nodemailer error : ",e)
    throw Error (e);
  }
};

module.exports = sendOTP;
