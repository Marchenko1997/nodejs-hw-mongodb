// src/models/session.js

import { model, Schema } from 'mongoose';


export const SessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
    accessTokenValidUntil: {type: Date, required: true},
    refreshTokenValidUntil: {type: Date, required: true},

});

export const SessionCollection = model('session', SessionSchema);
