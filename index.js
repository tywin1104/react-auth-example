const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index.route');
var cors = require('cors')
const app = express();


app.set('view engine', 'html')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname))

app.use(cors())
app.use('/api/', routes);
app.get('/', (req, res) => {
  res.render('index')
})

const mongo_uri = "mongodb://alen:kootracats@mentr-shard-00-00-2httx.mongodb.net:27017,mentr-shard-00-01-2httx.mongodb.net:27017,mentr-shard-00-02-2httx.mongodb.net:27017/mentr?ssl=true&replicaSet=mentr-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongo_uri, {});

let db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error'))
mongoose.connection.on('connected', ()=> {
  console.log("connected to db")
})


app.listen(process.env.PORT || 8080);
module.exports = app;
