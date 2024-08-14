import { NextRequest, NextResponse } from "next/server";
import connect from "../../../dbConfig/dbConfig";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const response = NextResponse.json({
      message: "Logged Out successfully",
      error: false,
    });

    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error:any) {
    NextResponse.json({
      message: error.message,
      error: true,
    });
  }
};
