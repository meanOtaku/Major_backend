import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import fetch from "node-fetch"


//Routes Require

import homeRoute from './routes/homeRoutes.js';
// import authRoute from './routes/authRoutes.js';
// import itemRoute from './routes/itemRoutes.js';
// import uploadRoute from './routes/uploadRoutes.js';
// import userRoute from './routes/userRoutes.js';


const app = express();


const port = process.env.PORT || 3000
const dbURI = '';
const dbURILocal = 'mongodb://localhost:27017/Users';
mongoose.connect(dbURILocal)
  .then((result) => app.listen(port, function(){
      console.log("Server Running " + `${ port }`);
  }))
  .catch((err) => console.log(err));


app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.use('/', homeRoute);
app.use('/home', (req, res) => {
    res.redirect('/');
})
// app.use('/item', itemRoute);
// app.use('/user', userRoute);
// app.use('/upload', uploadRoute);
// app.use(authRoute);


//404
app.use('*',(req, res) => {
    res.render('404', { title: '404' });
  });


