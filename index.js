const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// routes
const userRouter = require('./src/routes/userRouter')
const categoryRouter = require('./src/routes/categoryRouter')

dotenv.config()
const app = express();
const PORT = process.env.PORT || 4001;

// to save files for public
app.use(express.static('src/files'))

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cors());

// Routes
app.use('/user', userRouter)
app.use('/category', categoryRouter)

app.get('/', (req, res) => {
  res.send('ok')
})

const runServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, ()=> console.log(`Server started listen on port: ${PORT}`))
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
}

runServer()


