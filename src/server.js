import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from './utils/env.js';

import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setUpServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({ status: 'success', message: 'Successfully found contacts!', data: contacts });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Something went wrong', data: error.message });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      let { contactId } = req.params;

      contactId = contactId.trim();

      console.log(`Received request for contactId: ${contactId}`);

      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({ status: 'error', message: `Invalid ObjectId: ${contactId}`, data: null });
      }
      const contact = await getContactById(contactId);
      if (contact) {
        res.status(200).json({ status: 'success', message: `Successfully found contact with id ${contactId}!`, data: contact });
      } else {
        res.status(404).json({ status: 'error', message: 'Contact not found', data: null });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Something went wrong', data: error.message });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
