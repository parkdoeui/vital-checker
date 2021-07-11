import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { getVitals, postVital } from './controllers/userVital.ctrl.js'
import { getUserInfo } from './controllers/user.ctrl.js'
const app = express();
const vitalRouter = express.Router();
const userRouter = express.Router();

vitalRouter.get('/:userId', getVitals);
vitalRouter.post('/:userId/post', postVital);

userRouter.get('/:userId', getUserInfo);

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))
app.use(cors());

app.use('/vitals', vitalRouter);
app.use('/user', userRouter);

const USER_NAME = 'dopark'
const PASSWORD = 'mGjGs0miZ3xoQboa'
const CONNECTION_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.wtkgt.mongodb.net/vital-checker?retryWrites=true&w=majority`
const PORT = 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

