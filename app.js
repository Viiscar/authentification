// redis-server + npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const app = express();

//in-memory store
let redisClient = Redis.createClient();

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    PORT = 3000,
    SESS_NAME = "sid",
    SESS_SECRET = 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS,
    NODE_ENV ='development'
} = process.env;

const IN_PROD = NODE_ENV ==='production';

//TODO DB
const users = [
    {id:1, name:'fanch', email: 'efem@hotmail.com', password: 'pwd'},
    {id:2, name:'mignonne', email: 'mignonne@hotmail.com', password: 'pwd'},
    {id:3, name:'plazamerica', email: 'plazamerica@hotmail.com', password: 'pwd'}
]
app.use(bodyParser.urlencoded({
    extended: true
}))

// Creates a session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge:SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

//Redirects to /login if there is no user id
const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/login');
    }else{
        next();
    }
}

//Redirects to /home if there is an user id
const redirectHome = (req, res, next) => {
    if(req.session.userId){
        res.redirect('/home');
    }else{
        next();
    }
}

//Midleware to get connected user id
app.use((req, res, next) => {
    const {userId} = req.session;

    if (userId){
        res.locals.user = users.find(
            user => user.id === req.session.userId
            );
    }

    next();
})

//On route /
app.get('/', (req, res) =>{
    //console.log(req.session);
    const {userId} = req.session;
    res.send(`
        <h1>Welcome!</h1>
        ${userId ? 
            `<a href="home">home</a>
            <form method='post' action='/logout'>
                <button>logout</button>
            </form>`
            :
            `<a href="/login">login</a>
            <a href="/register">register</a>`
        }
    `)
});

//On route /home
app.get('/home', redirectLogin, (req, res) =>{
    //const user = users.find(user => user.id === req.session.userId)
    const {user} = res.locals;
    res.send(`
        <h1>home</h1>
        <a href="/">Main</a>
        <ul>
            <li>Name:${user.name}</li>
            <li>Email:${user.email}</li>
        </ul>
    `)

});

//On route /login
app.get('/login', redirectHome, (req, res) =>{
    res.send(`
        <h1>login</h1>
        <form method="post" action='/login'>
            <input type='email' name='email' placeholder='email' require />
            <input type='password' name='password' placeholder='password' require />
            <input type='submit' />
        </form>
        <a href="/register">register</a>
    `)
});

////On route /register
app.get('/register',redirectHome, (req, res) =>{
    //const {userId} = req.session;
    res.send(`
        <h1>register</h1>
        <form method="post" action='/register'>
            <input type='text' name='name' placeholder='name' require />
            <input type='email' name='email' placeholder='email' require />
            <input type='password' name='password' placeholder='password' require />
            <input type='submit' />
        </form>
        <a href="/login">login</a>
    `)
});

//When logging
app.post('/login', redirectHome, (req, res) =>{
    const {email, password} = req.body;

    if(email && password){ //TODO validation  (verify email and pwd length)
        const user = users.find(
            user => user.email === email && user.password === password //TODO hash pwd
        );

        if(user){
            req.session.userId = user.id;
            return res.redirect('/home');
        }
    }

    res.redirect('/login');
});

//When registering
app.post('/register', redirectHome, (req, res) =>{
    const {name, email, password} = req.body;

    if (name && email && password) { //TODO validation (verify email and pwd length)
        const exists = users.some(
            user => user.email === email
        )

        if(!exists){
            const user = {
                id: users.length + 1, //ajouter date ou req.session.id ?
                name,
                email,
                password // TODO hash
            }

            users.push(user);

            req.session.userId = user.id;

            return res.redirect('/home');
        }
    }
    
    res.redirect('/register'); //TODO qs /register?error=error.auth.userExist
});

//When loggin out
app.post('/logout',redirectLogin, (req, res) =>{
    req.session.destroy(err => {
        if(err){
            return res.redirect('/home');
        }

        res.clearCookie(SESS_NAME);
        res.redirect('/login');
    })
});

app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
);;