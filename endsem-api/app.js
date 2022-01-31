import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
const app = express();
const port = process.env.PORT || 5000


const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    img: [{
        type: String,
        unique: true
    }],
})

const Item = mongoose.model("Item", itemSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dbURIlocal = 'mongodb://localhost:27017/items'
const dbURI = 'your own key';
mongoose.connect(dbURIlocal, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port, function(){
      console.log("Server Running at port " + port);
  }))
  .catch((err) => console.log(err));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



//Item ROUTE--------------------------------------------------------------------
//finished whole route
app.route("/item")

.get(function(req, res){
    Item.find(function(err, foundItem){
        if(!err){
            console.log("Items Sended");
            res.send(foundItem);
        }else{
            res.send(err);
        }
    });
})

.post(function(req, res){
    var datetime = new Date();
    const newItem = new Item({
        title: req.body.title.trim(),
        content: req.body.content.trim(),
        contentType: req.body.contentType.trim(),
        Date: datetime,
        //AgeGroupRecommendation: req.body.AgeGroupRecommendation.trim()
    })

    newItem.save(function(err){
        if(!err){
            console.log("added Item");
            res.send("successfully added a new Item");
        }else{
            console.log(err);
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Item.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all items");
        }else{
            res.send(err);
        }
    });
});


//Inside Item------------------------------------------------------------------------
app.route("/item/:item_id")

//finished
.get(function(req, res){
    Item.findOne({_id: req.params.item_id}, function(err, foundItem){
        if(foundItem){
            console.log("Item Sended");
            res.send(foundItem);
        }else{
            res.send("No item matching");
        }
    });
})


.put(function(req, res){
    Item.updateOne(
        {_id: req.params.item_id},
        {title: req.body.title.trim(), content: req.body.content.trim(), contentType: req.body.contentType.trim()},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("successfully Edited");
            }
        }
    );
})

//finished
.patch(function(req, res){
    var exists = false;
    Item.findById(req.params.item_id, function(err, foundItem){
        if(!err){
            var sarray = foundItem.img;
            sarray.forEach(function(item){
                if(item == req.body.img){
                    console.log("Already Available");
                    exists = true;
                    
                }
            });
            if(exists == false){
                Item.updateOne(
                    {_id: req.params.item_id},
                    {$push: {img: req.body.img}},
                    function(err){
                        if(!err){
                            console.log(req.body);
                            console.log("Updated")
                            res.send("Updated");
                        }else{
                            res.send("Unable to update");
                        }
                    }
                );
            }
            else
                res.send("Already Exists");
        }
        else{
            res.send(err);
        }
    })
    
    
    
})

//finished
.delete(function(req, res){
    var url = 'http://localhost:8000/' + req.params.item_id;
    Item.deleteOne(
      {_id: req.params.item_id},
      function(err){
        if (!err){
            fetch(url, {
                method: 'delete',
                //body:    JSON.stringify(data),
                //headers: { 'Content-Type': 'application/json' },
              })
            console.log(req.params.item_id);
            res.send("Successfully deleted the corresponding item.");
        } else {
            res.send(err);
        }
      }
    );
  });


app.route("/item/:item_id/deleteImg")

.delete(function(req, res){
    console.log(req.body.img);
    Item.updateOne(
        {_id: req.params.item_id},
        {$pull: {img: req.body.img}},
        function(err){
            if(!err){
                console.log(req.body.img);
                res.send("Img deleted");
            }
        }
    )
});
