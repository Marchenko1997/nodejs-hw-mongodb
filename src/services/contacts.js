import { Contacts } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import {SORT_ORDER} from "../constants/index.js";

export const getAllContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = 'id' }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find();
  const contactsCount = await Contacts.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({[sortBy]: sortOrder})
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage, contacts);

  return {
    data: contacts,
    ...paginationData,
  };
};


export const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
};

export const createContact = async(payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await Contacts.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  return contact;
};

export const deleteContact = async(contactId) => {
  const contact = await Contacts.findByIdAndDelete(contactId);
  return contact;
};
