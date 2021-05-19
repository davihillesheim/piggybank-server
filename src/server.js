const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');
 
const app = express();
app.use(routes);
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3001, () => {
    console.log('App is running on port 3001');
});
