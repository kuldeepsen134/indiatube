import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/user";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { token } = body;

    console.log("body>>>>>>>>>>>>", token);

    const user = await User.findOne({ verifyToken: token });

    console.log("user>>>>>>>>>>>>", user);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
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
