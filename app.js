var telegramBot = require('node-telegram-bot-api');
var mysql = require('mysql');
const fs = require('fs');
var token ='544165360:AAEJCPDJABhG70bPCIEQ1NX5hOLoWpmQP4Q';
var api = new telegramBot(token, {polling: true});


// DB

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "xarbon"
});


con.connect(function(err){
	if(err) throw err;
	console.log("connected!");
});



// STEPS

api.onText(/\/Twitter/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Follow ProximaX on Twitter at @proximaxio or https://twitter.com/proximaxio",
		{
			parse_mode: 'html'
		}
		);
});

api.onText(/\/Facebook/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Like us on Facebook https://www.facebook.com/ProximaXPH/ \n\n" +
		"Remember to take a screenshot showing you’ve followed the ProximaX PH Facebook Page. It will be asked in step 4."
		);

});

api.onText(/\/Details/, function(msg, match) {

	var fromId = msg.from.id;
	var fname = msg.from.first_name;
	var lname = msg.from.last_name;

	var sql = "UPDATE newusers SET fname = '"+ fname +"',lname = '"+ lname +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('name added');
		api.sendMessage(fromId, "Kindly send your email: ");

		api.sendMessage(fromId,
			"Type /myemail <i>Your Email</i>",
			{
				parse_mode: 'html'
			}
			);
	});

});

api.onText(/\/Refer/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId, "Add up to 10 of your friends at @ProximaXPH / https://t.me/ProximaXPH Telegram group! \n\n" +
		"We will review if the added members are real accounts. If not, your bounty will be forfeited."
		);

});

api.onText(/\/Bonus Prize/, function(msg,match){
	var fromId = msg.from.id;

	api.sendMessage(fromId,"Like Minerodotcom Facebook Page at https://www.facebook.com/minerodotcom/ for a chance to win the following mining essentials:  \n\n" +
		"\u{1F537} 1st prize - GPU (Galax GTX 1070 8GB) \n" +
		"\u{1F537} 2nd prize - Motherboard (Asrock H110 Pro Btc+) \n" +
		"\u{1F537} 3rd prize - 2,000 PHP \n\n" +
		"Please send a screenshot showing you've followed the page. \n\n" +
		"Type /end when you're done with all the steps."
	);
});

api.onText(/\/NEM Address/, function(msg,match){
	var fromId = msg.from.id;

	api.sendMessage(fromId,"Enter your ProximaX / NEM address. XPX Airdrop bounty will be credited here. You can download via: \n\n" +
		"https://nem.io/downloads \n" +
		"https://play.google.com/store/apps/details?id=io.proxima.wallet"
	);
	api.sendMessage(fromId,"Type /nemaddress <i>nemaddress</i>",
		{
			parse_mode: 'html'
	});
});

api.onText(/\/Review Profile/, function(msg,match){
	var fromId = msg.from.id;

	var check = "SELECT * FROM newusers WHERE telegram_id='"+ fromId +"'";

	var userCheck = con.query(check,function(err,results){
		if(err) throw err;

		api.sendMessage(fromId,"Your Profile \n\n" +
			`<b>First Name:</b> ${results[0].fname}\n` +
			`<b>Last Name:</b> ${results[0].lname}\n` +
			`<b>Email:</b> ${results[0].email}\n` +
			`<b>Twitter Handle:</b> ${results[0].twitter}\n` +
			`<b>NEM Address:</b> ${results[0].nemaddress}\n\n` +
			"To update your profile: \n\n" +
			"Type /upfirstname <i>Your First name</i> \n" +
			"Type /uplastname <i>Your Last name</i> \n" +
			"Type /upemail <i>Your Email</i> \n" +
			"Type /uptwitter <i>Your Twitter Handle</i> \n" +
			"Type /upnemaddress <i>Your NEM Address</i> \n",
			{
				parse_mode : 'html'
			}
		);
	});
});

api.onText(/\/Users (.+)/, function(msg,match){
	var fromId = msg.from.id;
	var name = match[1];
	var id = "-" + name;

	api.sendMessage(fromId,msg.from.username);
});

api.onText(/\/end/, function(msg,match){
	var fromId = msg.from.id;

	api.sendMessage(fromId,"Thank you for participating in the ProximaX PH Airdrop bot! We will review all the entries and qualified users will be notified via Telegram. \n\n" +
		"\u{1F680} Only the first 200 participants who have completed the tasks shall receive 1,500 XPX each. This will be credited to the NEM address you have provided in step 4. \n\n" +
		"\u{1F4E3} Announcement of winners of the BONUS prizes will be posted on Minerodotcom Facebook Page. Stay tuned!"
		);
});
// END OF STEPS

// EMAIL
api.onText(/\/myemail (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET email = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('Email added');
		api.sendMessage(fromId, "Your email has been saved! \n\n" +
			"Kindly send your twitter username: \n\n" +
			"Type /mytwitter <i>Your Twitter Username</i>",
			{
				parse_mode: 'html'
			}
			);

	});
});

api.onText(/\/upemail (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET email = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('Email added');
		api.sendMessage(fromId, "Your email has been updated!",
			{
				parse_mode: 'html'
			}
			);

	});
});

//TWITTER USERNAME
api.onText(/\/mytwitter (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET twitter = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('Twitter added');
		api.sendMessage(fromId, 'Twitter username has been saved! \n\n' +
			"Type /nemaddress <i>NEM Address</i> \n\n" +
			"NOTE: To obtain a NEM address, download the official NEM wallet at <a href='https://nem.io/downloads'>https://nem.io/downloads</a> and follow the steps as instructed",
			{
				parse_mode:'html'
			}
			);

	});
});

api.onText(/\/uptwitter (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET twitter = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('Twitter added');
		api.sendMessage(fromId, 'Twitter username has been updated!',
		
			{
				parse_mode:'html'
			}
			);

	});
});
// NEM Address

api.onText(/\/nemaddress (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET nemaddress = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('NEM Address added');
		api.sendMessage(fromId, 'NEM Address has been saved! \n\n' +
			'Kindly send the facebook screenshot:'
			);


	});
});

api.onText(/\/upnemaddress (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET nemaddress = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('NEM Address Changed');
		api.sendMessage(fromId, 'NEM Address has been updated!'
			);
	});
});


//FIRST NAME

api.onText(/\/upfirstname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET fname = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('First Name Changed');
		api.sendMessage(fromId, 'First name has been updated!'
			);
	});
});

// LAST NAME
api.onText(/\/uplastname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var name = match[1];

	var sql = "UPDATE newusers SET lname = '"+ name +"' WHERE telegram_id = '"+ fromId +"'";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('Last Name Changed');
		api.sendMessage(fromId, 'Last name has been updated!'
			);
	});
});

api.on('photo', (msg) => {
	var fromId = msg.from.id;
	var photoId = msg.photo[msg.photo.length-1].file_id;
	var dir = `./${fromId}`;
	
	var path = api.downloadFile(photoId, dir).then(function (path) {
		console.log(path);
		api.sendMessage(fromId,"Screenshot has been received!"
			
			);
	});

});


//START
api.onText(/\/start/, function(msg, match) {

	var fromId = msg.from.id;
	var dir = './' + fromId;

	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		console.log("Directory Created!");
	}else{
		console.log("Directory exists!");
	}

	var fname = msg.from.first_name;
	var lname = msg.from.last_name;

	var query = "INSERT INTO newusers (telegram_id) VALUES ("+ fromId +")";
	var check = "SELECT * FROM newusers WHERE telegram_id='"+ fromId +"'";
	
	var userCheck = con.query(check, function(err, results){
		if(err){
			callback(err);
		}

		if(results.length != 0){
			console.log('user exists');

		}else {
			con.query(query,function(err,result){
			if(err) throw err;
			console.log('1 record added');

			});
		}
	});


	var options = {
	  reply_markup: JSON.stringify({
	  	resize_keyboard:true,
	    keyboard: [
	      [
	        {text: '\u{1F426}' + ' 1. /Twitter'},
	        {text: '\u{1F4F1}' + ' 2. /Facebook'},
	      ],
	      [
	      	{text: '\u{1F64B}' + ' 3. /Refer'},
	        {text: '\u{1F4DD}' + ' 4. /Details'}
	      ],
	      [
	      	{text: '\u{1F3C6}' + '5. /Bonus Prize'},
	      	{text: '\u{1F453}' + '6. /Review Profile'}
	      ]
	    
	    ]
	  })
	};

	api.sendMessage(fromId, `Hi ${fname}, welcome to ProximaX PH Airdrop bot! Start earning XPX tokens by joining the @ProximaXPH / https://t.me/ProximaXPH Telegram group! \n\n` +
		`Type /joined when you're done.`
		, options);
	


});

// JOINED

api.onText(/\/joined/, (msg, match) => {
	var fromId = msg.from.id;
	
	api.sendMessage(fromId,"Thank you for joining the ProximaX Philippines Official Telegram Group! Press/click the steps listed below to get started!\n\n" +
		"A total of 300,000 XPX will be given away. Only the first 200 participants who have completed the tasks shall receive 1,500 XPX each and have a chance to win the following mining essentials:  \n\n" +
		"\u{1F537} 1st prize - GPU (Galax GTX 1070 8GB) \n" +
		"\u{1F537} 2nd prize - Motherboard (Asrock H110 Pro Btc+) \n" +
		"\u{1F537} 3rd prize - 2,000 PHP \n\n"
		);
});


console.log("XPX Airdrop bot has started.");