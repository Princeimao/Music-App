import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface IUserRequest extends Request {
  user?: {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  };
}

export const authMiddleware = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["accessToken"] || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(400).json({
        success: false,
        message: "Access Denied, Not an Authenticated User",
        expired: true,
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT SECRET NOT FOUND");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      iat: number;
      exp: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Some error in auth middleware", error);
    //@ts-ignore
    if (error.name === "TokenExpiredError") {
      // Let frontend know token is expired
      res.status(401).json({
        success: false,
        message: "Access token expired",
        expired: true,
      });
      return;
    }

    // Other token errors (invalid, malformed, etc)
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }
};
