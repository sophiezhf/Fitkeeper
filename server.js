/* global __dirname */

var express = require('express'),
	app = express(),
	ejs = require('ejs'),
	https = require('https'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	JawboneStrategy = require('passport-oauth').OAuth2Strategy,
	port = 5000,
	jawboneAuth = {
        clientID: 'VotreClientID',
        clientSecret: 'VotreClientSecret',
        authorizationURL: 'https://jawbone.com/auth/oauth2/auth',
        tokenURL: 'https://jawbone.com/auth/oauth2/token',
        callbackURL: 'https://localhost:5000/fitkeeper/userdata.html' //mettez votre redirect page d'ici
    },
	sslOptions = {
		key: fs.readFileSync('./server.key'), //déplacez votre certificat file .key d'ici
		cert: fs.readFileSync('./server.crt') //déplacez votre certificat file .crt d'ici
	};

	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/public'));

	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');

// ----- Passport set up ----- //
app.use(passport.initialize());

app.get('/fitkeeper/login', 
	passport.authorize('jawbone', {
		scope: ['basic_read','sleep_read','move_read'], // limitez votre scope d'ici pour récupérer les données correspondantes
		failureRedirect: '/'
	})
);

app.get('/fitkeeper/userdata.html',
	passport.authorize('jawbone', {
		scope: ['basic_read','sleep_read','move_read'],
		failureRedirect: '/'
	}), function(req, res) {
		res.render('userdata', req.account);
	}
);

app.get('/fitkeeper/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/fitkeeper/sendrapport',function(){
    
});



app.get('/', function(req, res) {
	res.render('index');
});

passport.use('jawbone', new JawboneStrategy({
	clientID: jawboneAuth.clientID,
	clientSecret: jawboneAuth.clientSecret,
	authorizationURL: jawboneAuth.authorizationURL,
	tokenURL: jawboneAuth.tokenURL,
	callbackURL: jawboneAuth.callbackURL
}, function(token, refreshToken, profile, done) {
	var options = {
			access_token: token,
			client_id: jawboneAuth.clientID,
			client_secret: jawboneAuth.clientSecret
		},
	up = require('jawbone-up')(options);
       
        up.moves.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP heart rate data');
    	} else {
                
    		var jawboneData = JSON.parse(body).data;
                var rapport = "";
        	for (var i = 0; i < jawboneData.items.length; i++) {
        		var date = jawboneData.items[i].date.toString(),
        			year = date.slice(0,4),
        			month = date.slice(4,6),
        			day = date.slice(6,8);


        		jawboneData.items[i].date = day + '/' + month + '/' + year;
        		jawboneData.items[i].title = jawboneData.items[i].title.replace("aujourd\'hui","");
                        rapport = rapport + jawboneData.items[i].date + "   |    " + jawboneData.items[i].title.replace("aujourd\'hui","") + "\n";
        	}
           
                //sendmail(rapport);
			return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });
        /*
	up.sleeps.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP sleep data');
    	} else {
    		var jawboneData = JSON.parse(body).data;

        	for (var i = 0; i < jawboneData.items.length; i++) {
        		var date = jawboneData.items[i].date.toString(),
        			year = date.slice(0,4),
        			month = date.slice(4,6),
        			day = date.slice(6,8);


        		jawboneData.items[i].date = day + '/' + month + '/' + year;
        		jawboneData.items[i].title = jawboneData.items[i].title.replace('for ', '');
        	}

			return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });*/
}));
// ----- Send mail set up ----- //
var sendmail = function(rapport){
    
    var api_key = 'key-7d0c73b34f77198f3464f688c1e6e2b3';
    var domain = 'sandbox79c6fd7512fe4111adb5f70a2385122b.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    
    var data = {
      from: 'SPORT <mailgun@sandbox79c6fd7512fe4111adb5f70a2385122b.mailgun.org>',
      to: 'mengjie.shi@utt.fr',
      subject: 'Rapport',
      text: rapport
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
    
};



var secureServer = https.createServer(sslOptions, app).listen(port, function(){
  	console.log('UP server listening on ' + port);
});
