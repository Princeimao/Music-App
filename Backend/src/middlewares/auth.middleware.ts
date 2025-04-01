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
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(400).json({
        success: false,
        message: "Access Denied, Not an Authenticated User",
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
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }

    console.log("something went wrong while getting user (middleware)", error);
  }
};
