import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { getVitals, postVital } from './controllers/userVital.ctrl.js'
import { getUserInfo } from './controllers/user.ctrl.js'

dotenv.config();
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.wtkgt.mongodb.net/vital-checker?retryWrites=true&w=majority`
const PORT = process.env.PORT || 5000;

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

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

