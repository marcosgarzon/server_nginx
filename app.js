require('dotenv').config()
require('./strategies/local') 

const express = require('express')
const session = require("express-session");
const infoRouter = require("./routes/infoRouter.js") // MOD
const randomRouter = require("./routes/apiRandomsRouter.js") 
const passport = require('passport');
const mongoose = require('mongoose')
const MongoSession = require('connect-mongodb-session')(session)
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs')
const cluster = require('cluster')
const core = require('os')
const UserModel = require('./models/user');

const app = express();
const PORT = parseInt(process.argv.slice(2)) || 8080

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,   
  useUnifiedTopology: true
}).then( res => console.log('Conectado a la base de datos!'))
.catch( err => console.log('Error al conectarse con la base de datos!'))

const storeMS = new MongoSession({
  uri: process.env.MONGO_URI,
  collection: 'colSesiones'
})

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  secret: process.env.SECRETO_COOKIE,
  cookie: { maxAge: 600000 }, 
  saveUninitialized: false,  
  resave: false,
  store: storeMS 
}))

app.use(passport.initialize());

app.use(passport.session());


if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid}`)
  for (let i=0; i<core.cpus().length; i++) {
    cluster.fork()
  }
  cluster.on('exit', () => cluster.fork())
} else {
  app.listen(PORT, () => console.log(`Server up on port ${PORT} by process ${process.pid}`))
  
  const estaLogueado = (req, res, next) => {
    if(req.isAuthenticated()) return next()
  res.redirect('/login')
}

const estaDeslogueado = (req, res, next) => {
  if(!req.isAuthenticated()) return next()
  res.redirect('/')
}

app.get('/', estaLogueado, (req, res) => { 
  console.log(req.user);
  const response = req.user;    
  res.render('dashboard', response); 
})

app.get('/register', estaDeslogueado, (req, res) => {  
  const response = {
    error: req.query.error,
    msg: req.query.msg
   }
  res.render('register', response);
})

app.get('/login', estaDeslogueado, (req, res) => {  
  const response = {
   error: req.query.error
  }
  res.render('login', response);
})

app.post('/register', async (req, res) => { 
  const {username, email, password} = req.body;
  try {
    let user = await UserModel.findOne({ username })
    if(user) res.redirect('/register?error=true&msg=Username ya registrado')
    const hashPassword = await bcrypt.hash(password, 12);
    user = await UserModel.create({
      username,
      email,
      password: hashPassword
    })
    res.redirect('/');
  } catch (err) { 
    console.log(err)
  }
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?error=true'
}))

app.get('/logout', function (req, res, next) {
	req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect('/');
  });
});

app.use('/info', infoRouter)
app.use('/api/random', randomRouter)

}