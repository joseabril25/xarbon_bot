const telegramBot = require('node-telegram-bot-api');
const {MongoClient, ObjectID} = require('mongodb');
const fs = require('fs');
const express = require('express');

const port = process.env.PORT || 3000;

var token ='671240097:AAEv4vZ3ZB7wJzJSVJkAiTDxcvgUpXDGtn8';
var api = new telegramBot(token, {polling: true});
var app = express();

MongoClient.connect('mongodb://xarbon_bot:xarbon1@ds139331.mlab.com:39331/heroku_d5lmcw7r', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('heroku_d5lmcw7r');

	//START
  api.onText(/\/start/, function(msg, match) {

	var fromId = msg.from.id;
	var fname = msg.from.first_name;
	var lname = msg.from.last_name;
	var usn = msg.from.username;
	var dir = './' + fromId;

	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		console.log("Directory Created!");
	}else{
		console.log("Directory exists!");
	}

	
	db.collection('xarbon_users').find({
		telegramId: fromId
	}).limit(1).count().then((count) =>{
		if(count > 0){
			console.log('user exists');
		}else{
			db.collection('xarbon_users').insertOne({
			    telegramId: fromId,
			    userName: usn,
			    firstName: fname,
			    lastName: lname,
			    email: '',
			    twitterUsn: '',
			    nemAddress: ''
			  },(err, result) => {
			    if(err){
			      return console.log('Unable to insert user', err);
			    }

			    console.log(result.ops);
			    console.log('User is added');
			  });
		}
	},(err) => {
		console.log('Unable to fetch user', err);
	});

	


	var options = {
	  reply_markup: JSON.stringify({
	  	resize_keyboard:true,
	    keyboard: [
	      [
	        {text: '\u{1F426}' + ' 1. /Telegram'},
	        {text: '\u{1F4F1}' + ' 2. /Facebook'},
	      ],
	      [
	      	{text: '\u{1F64B}' + ' 3. /Twitter'},
	        {text: '\u{1F4DD}' + ' 4. /LinkedIn'}
	      ],
	      [
	      	{text: '\u{1F3C6}' + '5. /Refer'},
	      	{text: '\u{1F453}' + '6. /Profile'}
	      ]
	    
	    ]
	  })
	};

	api.sendMessage(fromId, `Hi ${fname}, welcome to the Xarbon Airdrop bot!  \n\n` +
		`\u{1F4E3} A total of 100 OCO tokens could be yours! \n\n` +
		`\u{1F537} 8 OCO tokens for joining our Telegram group \n` +
		`\u{1F537} 8 OCO tokens for liking our Facebook page \n` +
		`\u{1F537} 8 OCO tokens for following our Twitter \n` +
		`\u{1F537} 16 OCO tokens for following our LinkedIn page \n` +
		`\u{1F537} 10 OCO tokens for doing all of the above \n` +
		`\u{1F537} 50 OCO tokens for referring 10 members into our Telegram group \n\n` +
		`To start earning OCO tokens, please press /Telegram.`
		, options);
	});
  //START END

  // TELEGRAM JOIN
  api.onText(/\/Telegram/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Join @XarbonOCO / https://t.me/XarbonOCO Telegram group! \n\n" +
		"Come back here and type /joined once done.",
		{
			parse_mode: 'html'
		}
		);
	});

  // JOINED TELEGRAM
  api.onText(/\/joined/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Thank you for joining our Telegram group! Please press /Facebook to proceed. \n\n",
		{
			parse_mode: 'html'
		}
		);
	});

  // FACEBOOK
  api.onText(/\/Facebook/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Like us on Facebook https://www.facebook.com/XarbonOCO/ \n\n" +
		"Send a screenshot showing you’ve followed our Facebook page.",
		{
			parse_mode: 'html'
		}
		);
	});

  // FB Screenshot

  // TWITTER


  api.onText(/\/Twitter/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Follow #XarbonOCO on Twitter https://twitter.com/XarbonOCO \n\n" +
		"Please provide your Twitter username. \n\n" +
		"Type /twitterusn <i>Twitter Username</i>",
		{
			parse_mode: 'html'
		}
		);
	});


  // LINKEDIN
  api.onText(/\/LinkedIn/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Follow our LinkedIn page https://www.linkedin.com/company/xarbon/ \n\n" +
		"Send a screenshot showing you’ve followed our LinkedIn page.",
		{
			parse_mode: 'html'
		}
		);
	});

  //REFER
  api.onText(/\/Refer/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Bonus round! This is optional but worth a shot! Earn up to 50 OCO tokens by adding up to 10 of your friends into @XarcadeOCO / https://t.me/XarbonOCO Telegram group. Each successfully referred member will earn you 5 OCO tokens.  \n\n" +
		"There will be checks done to ensure the added members are real accounts. If not, your entire token earnings will be forfeited. \n\n" +
		"Finally, update your information by clicking /Profile. Without this information, we will not be able to distribute your airdrops.",
		{
			parse_mode: 'html'
		}
		);
	});

	// Profile
  api.onText(/\/Profile/, function(msg, match) {

	var fromId = msg.from.id;

	db.collection('xarbon_users').find({
		telegramId: fromId
	}).toArray().then((docs) => {
		console.log(docs);
		api.sendMessage(fromId,"Your Profile \n\n" +
			`<b>First Name:</b> ${docs[0].firstName}\n` +
			`<b>Last Name:</b> ${docs[0].lastName}\n` +
			`<b>Email:</b> ${docs[0].email}\n` +
			`<b>Twitter Username:</b> ${docs[0].twitterUsn}\n` +
			`<b>NEM Address:</b> ${docs[0].nemAddress}\n\n` +
			"To update your profile: \n\n" +
			"Type /upfirstname <i>Your First name</i> \n" +
			"Type /uplastname <i>Your Last name</i> \n" +
			"Type /upemail <i>Your Email</i> \n" +
			"Type /uptwitter <i>Your Twitter Handle</i> \n" +
			"Type /upnemaddress <i>Your NEM Address</i> \n",
			{
				parse_mode : 'html'
			});
	}, (err) => {
		console.log('user not found');
	});
   });

  // send images
  api.on('photo', (msg) => {
	var fromId = msg.from.id;
	var photoId = msg.photo[msg.photo.length-1].file_id;
	var dir = `./${fromId}`;
	
	fs.readdir(dir, function(err, files) {
	    if (err) {
	       console.log(err);
	    } else {
	       if (!files.length) {
	           var path = api.downloadFile(photoId, dir).then(function (path) {
					console.log(path);
					api.sendMessage(fromId,"FB screenshot has been received! Please press /Twitter to proceed."
						
						);
				});
	       }else{
	       		var path = api.downloadFile(photoId, dir).then(function (path) {
					console.log(path);
					api.sendMessage(fromId,"LinkedIn screenshot has been received! Please press /Refer to proceed."
						
						);
				});
	       }
	    }
	});
	

  });

  // TWITTER USN
  api.onText(/\/twitterusn (.+)/, function(msg, match) {
  	var twitterusn = match[1];
	var fromId = msg.from.id;

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			twitterUsn: twitterusn
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your Twitter username has been updated. Please press /LinkedIn to proceed.');
	},(err) => {
		console.log('unable to update twitter usn');
	});

  });

  //firstname update
  api.onText(/\/upfirstname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var fname = match[1];

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			firstName: fname
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your first name has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update first name');
	});
	
  });

  //lastname
  api.onText(/\/uplastname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var lname = match[1];

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			lastName: lname
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your last name has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update last name');
	});
	
  });

  //update email
  api.onText(/\/upemail (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var email = match[1];

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			email: email
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your email has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update email');
	});
	
  });

  //update twitter
  api.onText(/\/uptwitter (.+)/, function(msg, match) {
  	var twitterusn = match[1];
	var fromId = msg.from.id;

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			twitterUsn: twitterusn
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your twitter has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update twitter usn');
	});

  });

  //upnemaddress
  api.onText(/\/upnemaddress (.+)/, function(msg, match) {
  	var nem = match[1];
	var fromId = msg.from.id;

	db.collection('xarbon_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			nemAddress: nem
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your NEM address has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update nem address');
	});

  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});