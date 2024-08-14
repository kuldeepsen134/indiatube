import { NextRequest, NextResponse } from "next/server";
import connect from "../../../dbConfig/dbConfig";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../utils/mailHelper";
connect();

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { first_name, last_name, email, password } = reqBody;

    // Vailidation

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          error: true,
          message: "User already exist.",
        },
        { status: 400 }
      );
    }

    var salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      // verifyTokenExpiry: new Date(),
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      data: newUser,
      message: "User register successfully.",
    });
  } catch (error: any) {
    console.log("error>>>>>>>>>>>>>>>>>>", error);

    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
};
