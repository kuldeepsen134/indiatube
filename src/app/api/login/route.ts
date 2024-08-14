import { NextRequest, NextResponse } from "next/server";
import connect from "../../../dbConfig/dbConfig";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "This email is not registered.",
        },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          error: true,
          message: "Check your credentials",
        },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      first_name: user.first_name,
    };

    const options = {
      algorithm: "HS256",
      expiresIn: "1h",
    };

    const token =await jwt.sign(tokenData, process.env.TOKEN_SECRETE!, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    console.log("Generated Token:", token);

    // Set the token in a cookie
    const response = NextResponse.json(
      {
        error: false,
        message: "Logged in successfully",
        token: token, // Returning the token to the client
      },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true, maxAge: 3600 });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
