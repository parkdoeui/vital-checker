import express from 'express'
import mongoose from 'mongoose'
import { getVitals, createVitals } from './controllers/userVitalctrl.js'

const app = express();
const router = express.Router();

router.get('/', getVitals);
router.post('/post', createVitals);
// router.patch('/patch/:id', updateVitals);
// router.delete('/delete/:id', deleteVitals);


app.use('/vitals', router);

const USER_NAME = 'dopark'
const PASSWORD = 'mGjGs0miZ3xoQboa'
const CONNECTION_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.wtkgt.mongodb.net/vital-checker?retryWrites=true&w=majority`
const PORT = 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

