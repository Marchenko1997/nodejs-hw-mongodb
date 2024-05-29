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

export const updateContact = async(contactId, payload, options ={}) => {
  const rawResult = await Contacts.findByIdAndDelete(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultsMetaData: true,
      ...options,
    },
  );

  if(!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async(contactId) => {
  const contact = await Contacts.findByIdAndDelete({_id:contactId});
  return contact;
};
