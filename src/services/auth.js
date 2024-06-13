import createHttpError from "http-errors";
import {UsersCollection } from "../models/user.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { SessionCollection } from "../models/session.js";

export const registerUser = async(payload) => {
    const user = await UsersCollection.findOne({email: payload.email});
    if(user) throw createHttpError(409, 'Email in use');
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async(payload) => {
    const user = await UsersCollection.findOne({email: payload.email});
    if(!user) {throw createHttpError ('404', 'User not found');

    }
    const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);

    if(!isPasswordCorrect) {
     throw createHttpError(401, 'Unauthorized');
    }

    await SessionCollection.deleteOne({userId: user._id});

   const accessToken = randomBytes(30).toString('base64');
   const refreshToken = randomBytes(30).toString('base64');

   return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
   });

};
