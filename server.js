import express from 'express';
import cors from 'cors';
import {router} from './routes/router.js'

const app = express();
app.use(cors());
app.use(express.json())

app.use('/auth',router)

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log('listening on port:'+port))