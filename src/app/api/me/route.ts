import { NextRequest, NextResponse } from "next/server";
import connect from "../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../utils/getDataFromToken";
import User from "../../../models/user";

connect();

export const GET = async (req: NextRequest) => {
  try {
    // Extract data from token
    const userId = await getDataFromToken(req);

    const user =await User.findOne({ _id: userId }).select("-password");

    return NextResponse.json({
      data: user,
      message: "Me has been retrieve",
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
