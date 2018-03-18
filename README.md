# Express + MongoDB starter code for social todo homework

This is some starter code for the social todo homework. You can
inspect the `package.json` file to see what libraries we are using
here. The most important are [Express](http://expressjs.com) and
[MongoDB/Mongoose](http://mongoosejs.com).

## Getting started

You will need a Node environment and npm.
Clone the code, `cd` into the
code's directory and then download your dependencies with
`npm install`. This will populate your `node_modules` directory
with everything I used to complete the homework. Of course, you are
free to add and remove dependencies as you like for your solution.

## What I did for you

I did the models and all the code needed to hold everything together. After
I finished the homework, I replaced my controllers and views with dummy code.
_You do not have to use the same controllers and views as me_. You can use
any functions, routes, and views that get the job done. For that matter, you
are free to alter the models. This code is only to help you---you don't need
to use it.

## Running the code

This code needs a few environment variables in order to run: `MONGO_URL` and
`PORT`. You can also specify `HOST` and `SESSION_SECRET`. The `index.js` file, which
is the entry point, is the only file that reads variables from the environment.

When I completed the homework, my environment variables looked like this.
```
PORT=5000
SESSION_SECRET="NPOicW7oKb4rQKR+tHnMdGm0rh5W/d2/nUL3O0Y+5+E="
MONGO_URL="mongodb://localhost:27017/social-todo"
```

(You can get a good session secret by running the command
`openssl rand -base64 32` on a system where openssl is installed.)

Having set your environment variables and started MongoDB,
you can then run the code like

`npm start`

which will start it with nodemon, as shown in the `package.json` file.

# Running Mongodb

Clearly, for the application to work, you will need to be running Mongodb.
There are many ways to do this: running it locally (natively) on your 
computer, running it in a docker container, or using a hosted service.
Setting this up will require some research. If you come to office hours,
you can get assistance based on your preferences and development environment.

In "production", when you deploy your app, you will need Mongodb running 
somewhere other than your local computer, clearly.
