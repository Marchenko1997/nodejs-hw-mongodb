// src/controllers/contacts.js

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page = 1, perPage = 10 } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contactsData = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData.data,
    pagination: contactsData.pagination,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  try {
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      return next(
        createHttpError(404, {
          status: 404,
          message: 'Not Found',
          data: { message: 'Contact not found' },
        }),
      );
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  const { name, phoneNumber } = req.body;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
      photoUrl = `${env('BASE_URL')}/uploads/${photo.filename}`;
    }
  }
  const userId = req.user._id;

  if (!name || !phoneNumber) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!phoneNumber) missingFields.push('phoneNumber');

    return next(
      createHttpError(
        400,
        `Missing required fields: ${missingFields.join(', ')}`,
      ),
    );
  }

  try {
    const contactData = {
      ...req.body,
      userId,
      photo: photoUrl,
    };

    const contact = await createContact(contactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
      photoUrl = `${env('BASE_URL')}/uploads/${photo.filename}`;
    }
  }
  const userId = req.user._id;
  const result = await updateContact(contactId, req.body, userId, photoUrl);
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: {
      ...result.toObject(),
      photo: photoUrl,
    },
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};
