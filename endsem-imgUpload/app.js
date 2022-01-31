import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


app.use(express.static('images'));

const __dirname = dirname(fileURLToPath(import.meta.url));
/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());
  
/*------------------------------------------
--------------------------------------------
image upload code using multer
--------------------------------------------
--------------------------------------------*/
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
      cb(null,file.originalname);
   }
});
var upload = multer({ storage: storage });
   
/**
 * Create New Item
 *
 * @return response()
 */

 app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', (req, res) => {
    res.send("hi");
});

app.post('/:id/fileupload', upload.single('image'),(req, res) => {
    var dir = 'images/' + req.params.id;
    var url = 'http://localhost:5000/item/' + req.params.id ;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const image = req.file.filename;
    var oldpath = path.join(__dirname, '/uploads/', image);
    var newPath = path.join(__dirname, dir , '/' , image)
    var fulldir = dir + "/" + image;
    //fulldir = fulldir.replace(/\//g, "~");
    var data = {
      img: fulldir,
    }
    console.log(fulldir);
    fetch(url, {
      method: 'patch',
      body:    JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    fs.copyFileSync(oldpath , newPath)
    fs.unlinkSync(oldpath);
    console.log(image);
    res.send(apiResponse({message: 'File uploaded successfully.', image}));
    //res.redirect('http://localhost:8080/admin');
});

app.delete('/:id/:filename', (req, res) => {
    var url = 'http://localhost:5000/item/' + req.params.id + '/' +'deleteImg';
    var filetoDelete = 'images' + "/" + req.params.id + "/" + req.params.filename ;
    var dir = 'images/' + req.params.id;
    var image = req.params.filename;
    var Path = path.join(__dirname, dir , '/' , image)
    fs.unlink(Path,(err => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file: " + image);
        
          // Get the files in current directory
          // after deletion
        }
      }));
      console.log(filetoDelete);
    var data = {
      img : filetoDelete
    }
    fetch(url, {
      method: 'delete',
      body:    JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    res.send(apiResponse({message: 'File deleted successfully.', image}));
    //res.redirect('http://localhost:8080/admin');
});

app.delete('/:id', (req, res) => {
  //var oldpath = path.join(__dirname, '/uploads/', req.params.filename);
  var dir = 'images/' + req.params.id;
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(req.params.filename);
  res.send(apiResponse({message: 'Dir deleted successfully.'}));
  //res.redirect('http://localhost:8080/admin');
});
  
/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results){
    return JSON.stringify({"status": 200, "error": null, "response": results});
}
  
/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(8000,() =>{
  console.log('Server started on port 8000...');
});