// src/index.js

import { initMongoConnection } from './db/initMongoDB.js';
import { setUpServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setUpServer();
};

bootstrap();

