// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import {env} from './utils/env.js';

import {getAllContacts , getContactById} from './db/services/contacts.js';

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
      res.status(200).json({ data: contacts, message: 'Successfully found contacts!' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
      res.status(200).json({ data: contact, message: 'Successfully found contact with id {contactId}!' });
    } catch (error) {
      res.status(404).json({ message: 'Something went wrong', error: error.message });
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};


