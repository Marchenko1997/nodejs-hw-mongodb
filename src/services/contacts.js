import { Contacts } from '../models/contacts.js';

export const getAllContacts = async () => {
  return await Contacts.find();
};

export const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
};

export const createContact = async(payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async(contactId, payload, options = {}) => {
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
