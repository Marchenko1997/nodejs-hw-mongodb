import createHttpError from 'http-errors';
import { Contacts } from '../models/contacts.js';
import { ROLES } from '../constants/index.js';

export const checkRoles = (...roles) => async (req, res, next) => {
  const { user } = req;
  if (!user) {
    next(createHttpError(401));
    return;
  }

  const { role } = user;
  if (roles.includes(ROLES.ADMIN) && role !== ROLES.ADMIN) {
    next(createHttpError(403));
    return;
  }

  if (roles.includes(ROLES.USER)) {

    const { contactId } = req.params;
    if (contactId) {
      const contact = await Contacts.findOne({
        _id: contactId,
        userId: user._id,
      });

      if (!contact) {
        next(createHttpError(403));
        return;
      }
    }
  }

  next();
};
