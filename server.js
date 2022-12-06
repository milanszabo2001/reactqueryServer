import express from 'express';
import cors from 'cors';
import {router} from './routes/router.js'
import fileUpload from 'express-fileupload';

const app = express();
app.use(cors());
app.use(express.json())
//temporary library
app.use(fileUpload({
    useTempFiles: true,
    //tempFileDir:'/tmp/'
}))

app.use('/auth',router)

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log('listening on port:'+port))