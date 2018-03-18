// eslint no-param-reassign: ["error", { "props": false }]
// eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]


'use strict';


const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');
var usermain = null;

const app = express();
mongoose.connect(process.env.MONGO_URL);

const Users = require('./models/users.js');
const Tasks = require('./models/tasks.js');

// Configure our app
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure session middleware that will parse the cookies
// of an incoming request to see if there is a session for this cookie.
app.use(session({
    secret: process.env.SESSION_SECRET || 'super secret session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto',
    },
    store,
}));

// Middleware that looks up the current user for this sesssion, if there
// is one.
app.use((req, res, next) => {
    if (req.session.userId) {
        Users.findById(req.session.userId, (err, user) => {
            if (!err) {
                res.locals.currentUser = user;
            }
            next();
        });
    } else {
        next();
    }
});


/**
 * Middleware that checks if a user is logged in.
 * If so, the request continues to be processed, otherwise a
 * 403 is returned.
 * @param  {Request} req - The request
 * @param  {Response} res - sdf
 * @param  {Function} next - sdfs
 * @returns {undefined}
 */
function isLoggedIn(req, res, next) {
    if (res.locals.currentUser) {
        next();
    } else {
        res.sendStatus(403);
    }
}

/**
 * Middleware that loads a users tasks if they are logged in.
 * @param  {Request} req - An express request object
 * @param  {Response} res - An express response object
 * @param  {Callback} next - Called when the function is done
 * @returns {undefined}
 */

function loadUserTasks(req, res) {

    /*var returns = [];
     for(var i = 0; i < Tasks; i++)
    {
      if(Tasks.TaskSchema.owner == req.user)
      {
        returns.push(Tasks.TaskSchema.name)
      }

    }
    return returns;
    */

    if(usermain != null)
    {
      /*Tasks.find({owner: usermain._id}, function (err, tasks) {
          if (err) return console.error(err);
          else res.render('index', tasks);


        });
        var query = Tasks.find({ 'owner': 'usermain._id' });
        res.render('index', query.select('name'));*/
        //console.log(Tasks.find({owner: usermain._id}));


        //res.render('index', usermain, );
        console.log('loaded');

        Tasks.find({owner: usermain._id}, function(err, tasks) {
          //and collaborators: usermain._id
          if(err) {
            res.send('error getting tasks');
          }else{
            console.log(tasks);
            res.locals.currentUser = usermain;
            //console.log(res.locals.currentUser + ' this is current user');
            res.locals.tasks = tasks;
            res.render('index', tasks);
          }
        }
      );


        //Tasks.find({owner: usermain._id})
    }

    /*Tasks.find({}, function(err, tasks) {
    if (!err){
        numTotalTasks = tasks.length;
    } else {throw err;}

    var returns = [];
     for(var i = 0; i < numTotalTasks; i++)
    {
      if( == req.user)
      {
        returns.push(Tasks.TaskSchema.name)
      }

    }
    return returns;
}); */


    //we need a getUserTasks method in tasks
  //res.render(usertasks);

    //next();
}

// Return the home page after loading tasks for users, or not.
app.get('/', (req, res) => {

  console.log(usermain + ' this is the currentUser status at / path');

   if(usermain != null)
    {
      console.log('logged in');
      loadUserTasks(req, res);
    }
    else
    {

      Users.find({}, function(err, users) {
        if(err) {
          res.send('error getting users');
        }else{
          res.render('index');
        //res.send('I found ' + users.length + ' users');
        //console.log(users.length);
    }
  });


    }
  // res.render('index');
});

// Handle submitted form for new users
app.post('/users/register', (req, res) => {

    var newUser = new Users();
    newUser.hashed_password = req.body.password;
    //if email is good:
    if(req.body.email.includes('@') && req.body.email.length <= 50
    && req.body.name != null && req.body.name != '' && req.body.name.length <= 50
    && req.body.password != null && req.body.password != '' && req.body.password.length <= 50){
        //save the user
      newUser.email = req.body.email;
      console.log('The user has the email address', req.body.email);
      newUser.name = req.body.name;
      newUser.save({});
      res.redirect('/');
      }

  else{
      console.log('user registration didnt meet criteria');
      res.sendStatus(401);
    }

});

app.post('/users/login', (req, res) => {

Users.find({ email: req.body.email}, (function (err, userarray) {
  if (err) return console.error(err);
  console.log(userarray);

  //there should now be a user array with length 1 created with a single user object

  userarray[0].comparePassword(req.body.password, function  (err, isMatch) {
    if (err) return console.error(err + 'error in user array');
    console.log(isMatch);
    if(isMatch)
    {
      res.locals.currentUser = userarray[0];
      console.log(res.locals.currentUser + 'matched woo');
      usermain = userarray[0];
      res.redirect('/');
    }
    else {
      res.sendStatus(401);
    }

});

}))});


// Log a user out
app.get('/user/logout', (req, res) => {
    req.session.destroy();
    res.locals.currentUser = null;
    usermain = null;
    res.redirect('/');
});

//  All the controllers and routes below this require
//  the user to be logged in.

//app.use(isLoggedIn);

// Handle submission of new task form
app.post('/tasks/:id/:action(complete|incomplete)', (req, res) => {
  Tasks.find({ _id: req.params.id}, (function (err, taskarray) {
    if (err) return console.error(err);
    //there should now be a user array with length 1 created with a single user object
    if (taskarray[0].isComplete == true)
    {
      taskarray[0].isComplete = false;
      taskarray[0].save({});
    }
    else
    {
      taskarray[0].isComplete = true;
      taskarray[0].save({});
    }
    res.redirect('/');

}
)
)
});

app.post('/tasks/:id/delete', (req, res) => {
    ///tasks/:id/delete

    Tasks.remove({_id: req.params});
    res.redirect('/');

});

// Handle submission of new task form
app.post('/task/create', (req, res) => {

  res.locals.currentUser = usermain;

  var newTask = new Tasks();

  newTask.owner = usermain._id;
  newTask.name = req.body.name;
  newTask.description = req.body.description;
  newTask.isComplete = false;
  newTask.collaborators =  req.body.collaborators;

  newTask.save({});

  res.redirect('/');

});



// Start the server
const port = process.env.PORT || 4400;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


/*

await Users.comparePassword(pw1, pw2);

async function list(req, res) {
    const db = req.app.get('db');
    let result = {
        movies: [],
        error: null,
    };
    // TODO: fill me in. Get all the movies
    // here and send them to the template/view.
    //movies = await movieModels.getAll(db);

    var titleInput = req.query.title;
    console.log(req.query.title);

    if(titleInput !== undefined)
    {
      result = await movieModels.getByTitle(db, titleInput);
    }

    else
    {
      result =
    }

    res.render('movie-list', result);
    console.log(result);


}
*/

module.exports = {
  usermain
};
