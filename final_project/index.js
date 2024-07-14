const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require('./router/booksdb.js');

const app = express();
const SECRET_KEY = 'SuperSecretKey';

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    let token = req.header('Authorization');
    if (!token) {
        res.status(401).send('No provided token');
    }
    else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(500).send({ message: 'Failed to authenticate token.' });
            }
            req.userId = decoded.id;
            next();
        });
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));