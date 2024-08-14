import nodemailer from "nodemailer";
import User from "../models/user";
import bycrpt from "bcryptjs";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bycrpt.hash(userId.toString(), 10);

    console.log({ email, emailType, userId });

    // Configure mail for usage
    if (emailType === "VERIFY") {
      const updateUser = await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verfiyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "71f9cb3a0706be",
        pass: "f260900fdb0ec2",
      },
    });

    const mailOptions = {
      from: "ssandbox75@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify you email" : "Reset your password", // Subject line
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERFIY" ? "Verify your email" : "Reset you password"
      } 
      or copy and past the link below in your browser.
      <br>
    ${process.env.DOMAIN}/verfyemail?token=${hashedToken}
      </p>`, // html body
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailOptions;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
