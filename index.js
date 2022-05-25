// importing all dependencies 
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ancRoute = require('./routes/announcements');
const authRoute = require('./routes/auth');

dotenv.config();
const app = express();

var cors = require('cors');
var corsOptions = {
    origin : "*", 
    optionsSuccessStatus : 200 
}

app.use(cors(corsOptions))
app.options('*', cors())

// middlewares
app.use(express.json());
app.use(helmet( {crossOriginResourcePolicy: false} ));
app.use(morgan('common'));

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 

// Routes
app.use('/auth', authRoute);
app.use('/announcements', ancRoute);

// connecting to mongoDB
const dbURL = process.env.dbURL;

mongoose.connect( dbURL, { useNewUrlParser: true, useUnifiedTopology:true } )
    .then( console.log('Connected to database') )
    .catch( (err) => { console.log(err) } )
    app.listen( 3080 , () => {
        console.log('Server is running')
    }
);