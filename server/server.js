const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const crypto = require('crypto');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const PORT = 3001;

const dotenv = require("dotenv");
dotenv.config(); // get config vars
// access config var: process.env.TOKEN_SECRET;

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

let users = [{
  name: "woojun",
  email: "woojun@test.com",
  password: getHashedPassword('1234')
}]


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.headers['auth-token'];

  // Inject the user to the request
  req.user = authTokens[authToken];

  next();
});


const authTokens = {};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hasehedPassword = getHashedPassword(password);

  const user = users.find(u => {
    return u.email === email && hasehedPassword === u.password
  });

  if (user) {
    const authToken = generateAuthToken();

    // store authentication token
    authTokens[authToken] = user;

    // setting the auth token in cookies
    // res.cookie('AuthToken', authToken);
    // doesnt work:....why????

    // redirect to home
    res.send({ authToken })

  } else {
    res.status(409).send('Invalid User')
  }

})

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (users.find(user => user.email === email)) {
    return res.status(409).send('email is already registered')
  }

  const hasehedPassword = getHashedPassword(password);
  users.push({
    name,
    email,
    password: hasehedPassword
  })

  res.status(201).send({ name, email })

})

app.get('/userinfo', (req, res) => {
  console.log(authTokens);
  console.log(req.user);
  console.log(req.headers);

  res.send();
})



// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }

app.listen(PORT, console.log(`server is listening on ${PORT}`))