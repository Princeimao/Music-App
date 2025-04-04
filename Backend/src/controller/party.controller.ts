import { Response } from "express";

import { IUserRequest } from "../middlewares/auth.middleware";
import partyModel from "../model/party.model";
import userModel from "../model/user.model";

export const createParty = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    const party = await partyModel.create({
      room_name: name,
      admins: userId,
    });

    if (!party) {
      res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { parties: userId },
    });

    res.status(200).json({
      success: true,
      message: "Party Created Successfully",
    });
  } catch (error) {
    console.log("something went wrong creating party", error);
    res.status(400).json({
      success: false,
      message: "soemthing went wrong while creating party",
    });
  }
};


