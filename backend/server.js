const express = require('express');
const cors = require('cors');
const vehiclesRoutes = require('./routes/vehicles');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/vehicles', vehiclesRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Management API!');
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
