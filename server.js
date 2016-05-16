var express=require('express'),				// Express.js library framework used to load all the 'packages' with extra functionality below
	app = express(),						// Initialize Express.js
	http = require('http'),
	cors = require('cors'),					// Cross Origin Request S for Express.js
	bodyParser = require('body-parser'),	// Body parser for incoming HTTP requests
	mysql = require('mysql'),				// MySQL for DB connection
	cheerio = require('cheerio'),			// Cheerio HTML parser
	XMLHttpRequest = require('xhr2'),		// XMLHttpRequest library
	expressJWT = require('express-jwt'),	// JSON Web Tokens to generate login session tokens
	jwt = require('jsonwebtoken'),
	passwordHash = require('password-hash'),// For hashing passwords
	crypto=require('crypto'),				// For hashing user IDs
	mailer=require('nodemailer'),			// For sending emails
	cron=require('cron').CronJob;			// For scheduling weekly emails
	json2csv=require('json2csv');		// JSON to CSV Converter

app.use(cors());			// Add CORS middleware for Express.js
app.use(bodyParser.json());	// Add BodyParser middleware for Express.js

// Create connection pool to the DB
connectionPool=mysql.createPool({
	host	: 'au-cdbr-azure-east-a.cloudapp.net',
	user	: 'bfb0fd8ebc47c6',
	password: '8b820705',
	database: 'orionhackathon2016',
	connectionLimit : 1
});

//---------------------------------------------
// GET for a specific record (no auth required)
//---------------------------------------------

app.get('/test',function(req,res){
	runQuery('SELECT * FROM test',function(data){
		res.setHeader('Content-Type','application/json');
		res.send(data);
	})
});


//---------------------------------------------
// PUT is per convention used to update/add a specific record (no auth required)
//---------------------------------------------

/**
 * PUT /users/{userId}
 * Updates information about a user
 */
app.put('/users/:id',function(req,res){
});

//-------------------------
// Utility/helper functions
//-------------------------

/**
 * Runs a query
 * @param {string} query the query to run
 * @param {function(rows)} callback the callback to send the result to
 * @param {function(err)} errorCallback called if there is an error running the query
 */
function runQuery(query,callback,errorCallback){
	connectionPool.getConnection(function(err,connection){
		connection.release();
		if (err && errorCallback) {
			errorCallback(err);
		} else {
			connection.query(query,function(err,rows,fields){
				if (err && errorCallback) {
					errorCallback(err);
				}else{
					if(callback){
						callback(rows);
					}
				}
			});
		}
	});
}

/**
 * Start the Express.js server
 * process.env.port is necessary for running it on Azure
 */
console.log('Server started on port '+(process.env.PORT || 3000));
app.listen(process.env.PORT || 3000);