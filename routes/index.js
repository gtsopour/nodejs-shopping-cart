var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var bodyParser = require('body-parser');
var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
var elektronik = JSON.parse(fs.readFileSync('./data/elektronik.json', 'utf8'));
var bakim = JSON.parse(fs.readFileSync('./data/bakim.json', 'utf8'));
var spor = JSON.parse(fs.readFileSync('./data/spor.json', 'utf8'));
var kategoriler = JSON.parse(fs.readFileSync('./data/kategoriler.json', 'utf8'));
router.use(bodyParser.urlencoded());

router.use(bodyParser.json());
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'deneme'
  
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

router.get('/', function (req, res, next) {
  res.render('index', 
  { 
    title: 'UcuzaAL',
    products: kategoriler
  }
  );
});

router.get('/elektronik', function (req, res, next) {
  res.render('kategoriler', 
  { 
    title: 'UcuzaAL',
    products: elektronik
  }
  );
});

router.get('/bakim', function (req, res, next) {
  res.render('kategoriler', 
  { 
    title: 'UcuzaAL',
    products: bakim
  }
  );
});

router.get('/spor', function (req, res, next) {
  res.render('kategoriler', 
  { 
    title: 'UcuzaAL',
    products: spor
  }
  );
});

router.get('/register', function (req, res, next) {
  res.render('register', 
  { 
    title: 'UcuzaAL'
  }
  );
});



router.get('/urunler', function (req, res, next) {
  res.render('kategoriler', 
  { 
    title: 'UcuzaAL',
    products: products
  }
  );
});

router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;

  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('back');

});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      elektronik: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Sepetiniz',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});



router.get('/login', function (req, res, next) {
  res.render('login', 
  { 
    title: 'UcuzaAL',
  }
  );
});



router.get('/logout', async (request, response) => {
  if (request.session.username) {
      delete request.session.username;
      request.session.loggedin = false
      response.redirect('/');
  } else {
      
  }
});


router.get('/profile', function (req, res, next) {
  res.render('profile', 
  { 
    title: 'UcuzaAL',
  }
  );
});

router.get('/payment', function (req, res, next) {
  res.render('payment', 
  { 
    title: 'UcuzaAL',
  }
  );
});

router.get('/onay', function (req, res, next) {
  res.render('onay', 
  { 
    title: 'UcuzaAL',
  }
  );
});


// http://localhost:3000/auth
router.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true
				request.session.username = username;
        request.session.username = results[0];
        response.render('header', { username: request.session.username });
				// Redirect to home page
        
				response.redirect('/');
			} else {
        message = 'Wrong Credentials.';
				response.send('Kullanıcı Adı veya Şifre Yanlış!');
			}			
			response.end();
		});
	} else {
		response.send('kullancı veya Şifre Gİrmediniz');
		response.end();
	}
});

//dashborad




router.post('/register', function(request, response) {
	// Capture the input fields
  let email = request.body.email;
	let username = request.body.username;
  let address = request.body.adress;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
  if (username && password) {

		  var sql = `INSERT INTO accounts ( username, password, email,address) VALUES ( '${username}', '${password}', '${email}','${address}')`; {
      connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }else{
            // using userPage function for creating user page
            response.redirect('/');
            
        };
    });
      }}
});




// router.post('/register', bodyParser, (req, res) => {
//   var username = req.body.username;
//   var password = req.body.password;
//   var email =req.body.email;

//   connection.connect(function(err) {
//       if (err){
//           console.log(err);
//       };
//       // checking user already registered or no
//       connection.query(`SELECT * FROM accounts WHERE username = '${username}' AND password  = '${password}'`, function(err, result){
//           if(err){
//               console.log(err);
//           };
//           if(Object.keys(result).length > 0){
//               res.sendFile(__dirname + '/error');
//           }else{
//           //creating user page in userPage function
//           function userPage(){
//               // We create a session for the dashboard (user page) page and save the user data to this session:
//               req.session.user = {
//                   id:100,
//                   username: username,
//                   password: password,
//                   email:email
//               };

            
//           }
//               // inserting new user data
//               var sql = `INSERT INTO accounts (id, username, password, mail) VALUES ('${id}', '${username}', '${password}', '${email}')`;
//               connection.query(sql, function (err, result) {
//                   if (err){
//                       console.log(err);
//                   }else{
//                       // using userPage function for creating user page
//                       userPage();
//                   };
//               });

//       }

//       });
//   });


// });








module.exports = router;
