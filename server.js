import express from 'express';
import cors from 'cors';
import {router} from './routes/router.js'
import fileUpload from 'express-fileupload';

const app = express();
app.use(cors());
app.use(express.json())

app.use(fileUpload({
    useTempFiles: true
}))

app.use('/auth',router)

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log('listening on port:'+port))