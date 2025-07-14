require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shortUrlRoutes = require('./routes/shortUrlRoutes');
const requestLogger = require('./middleware/requestLogger');

const app = express();
app.use(express.json());
app.use(requestLogger); 

app.use('/', shortUrlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connected to DB`);
  })
  .catch(err => {
    const Log = require('./utils/logger');
    Log("backend", "fatal", "db", "MongoDB connection failed: " + err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
