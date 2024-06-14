import createHttpError from "http-errors";

import { SessionsCollection } from "../models/session.js";
import { UsersCollection } from "../models/user.js";

export const authenticate = async (req, res, next) => {
 const authHeader = req.get("Authorization");

 if(!authHeader) {
    next(createHttpError(401, 'Please provide authorization token!'));
    return;
 }

 const bearer = authHeader.split(' ')[0];
 const token = authHeader.split(' ')[1];

 if( bearer !== 'Bearer' || !token) {
  next(createHttpError(401, 'Auth header should be of type Bearer'));
  return;
 }

 const session = await SessionsCollection.findOne({ accessToken: token});

 if(!session) {
    next(createHttpError(401,'Session is not found'));
    return;
 }

 const isAccessTokeExpired = new Date() > new Date()(session.accessTokenValidUntil);
 if(isAccessTokeExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
 }

 const user = await UsersCollection.findById(session.userId);
 if(!user) {
    next(createHttpError(401, 'User is not found'));
    return;
 }

 req.user = user;

 next();
};
