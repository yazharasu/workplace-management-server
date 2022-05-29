// importing all dependencies
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ancRoute = require('./routes/announcements');
const authRoute = require('./routes/auth');
var cors = require('cors');


dotenv.config();
const app = express();

var corsOptions = {
    origin : ['http://localhost:3080', 'https://fa-intranet.netlify.app'],
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

var publicDir = __dirname + "/public";
app.use(express.static(publicDir));
app.use(favicon(__dirname + '/public/favicon.png'));

// Routes
app.use('/auth', authRoute);
app.use('/announcements', ancRoute);
app.get('/', (req, res) => { res.send('Hello from Express!') } )


// connecting to mongoDB
const dbURL = process.env.dbURL;

mongoose.connect( dbURL, { useNewUrlParser: true, useUnifiedTopology:true } )
    .then( console.log('Connected to database') )
    .catch( (err) => { console.log(err) } )
    app.listen( process.env.PORT || 3080 , () => {
        console.log('Server is running')
    }
);
