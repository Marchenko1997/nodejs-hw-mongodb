// src/controllers/auth.js

import { registerUser } from '../services/auth.js';
import { loginUser, logoutUser } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { refreshUsersSession } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.json({
            status: 201,
            message: 'Successfully registered a user!',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const loginUserController = async (req, res, next) => {
    try {
        const session = await loginUser(req.body);
        res.cookie('refreshToken', session.refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + THIRTY_DAYS),
        });
        res.cookie('sessionId', session._id, {
            httpOnly: true,
            expires: new Date(Date.now() + THIRTY_DAYS),
        });

        res.json({
            status: 200,
            message: 'Successfully logged in an user!',
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        if (error.message === 'User not found') {
            next(createHttpError(401, 'Unauthorized'));
        } else {
            next(error);
        }
    }
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
};

export const refreshUserSessionController = async (req, res, next) => {
    try {
        const session = await refreshUsersSession({
            sessionId: req.cookies.sessionId,
            refreshToken: req.cookies.refreshToken,
        });

        setupSession(res, session);

        res.json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logoutUserController = async (req, res, next) => {
    try {
        if (req.cookies.sessionId) {
            await logoutUser(req.cookies.sessionId);
        }
        res.clearCookie('sessionId');
        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
