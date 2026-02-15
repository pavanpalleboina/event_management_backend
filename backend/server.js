const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = 5000

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173'}));


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));


mongoose.connect(process.env.MONGODB_URI)
.then(()=>(console.log('MongoDB is Connected Successfully')))
.catch((error)=>{
    console.log('MongoDB Connection is Error',error)
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})