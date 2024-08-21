const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const uploadRoute = require('./routes/upload.js');
const downloadRoute = require('./routes/download.js');
const roomRoute = require('./routes/room.js');
const port = process.env.PORT || 8001;
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB');
})

app.use('/upload', uploadRoute);
app.use('/download', downloadRoute);
app.use('/room',roomRoute)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
