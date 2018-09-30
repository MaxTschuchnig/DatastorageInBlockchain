console.log('In Programm');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function addMany(_items) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("Tickets");
        dbo.collection("Tickets").insertMany(_items, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
        });
    });

}

const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const port = 12345;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cors());

app.put('/', (request, response) => {
    addMany(request.body);

    response.send('Hello from Express!');
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log('server is listening on ' + port);
})