const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../pool');
const mongoose = require('mongoose');
const async = require('async');
const app = express();

let userSchema = mongoose.Schema(
   {
      userid: String,
      name: String,
      city: String,
      gender: String,
      age: Number,
   },
   {
      versionKey: false,
   },
);

let User = mongoose.model('users', userSchema);
app.get('/Hello', (req, res) => {
   res.send('Hello World');
   return;
});

app.get('/list', (req, res, next) => {
   User.find({}, (err, docs) => {
      if (err) console.log(err);
      // console.log(docs);
      res.send(docs);
      return;
   });
   return;
});

app.get('/get', (req, res, next) => {
   let userid = req.query.input.toString();
   console.log(req.query.input);
   User.findOne({ userid: userid }, (err, docs) => {
      if (err) console.log(err);
      // console.log(docs);
      res.send(docs);
      return;
   });
   return;
});

app.post('/insert', (req, res, next) => {
   let userid = req.body.userid;
   let name = req.body.name;
   let city = req.body.city;
   let gender = req.body.gender;
   let age = req.body.age;
   let user = new User({ userid: userid, name: name, city: city, gender: gender, age: age });
   user.save((err, silence) => {
      if (err) {
         console.log(err);
         res.status(500).send('insert error');
         return;
      }
      res.status(200).send('Inserted');
      return;
   });
});

app.post('/update', (req, res, next) => {
   let userid = req.body.userid;
   let name = req.body.name;
   let city = req.body.city;
   let gender = req.body.gender;
   let age = req.body.age;

   User.findOne({ userid: userid }, (err, user) => {
      user.name = name;
      user.city = city;
      user.gender = gender;
      user.age = age;
      user.save((err, silence) => {
         if (err) {
            console.log(err);
            res.status(500).send('update error');
            return;
         }
         res.status(200).send('Updated');
         return;
      });
   });
});

app.post('/delete', (req, res, next) => {
   let userid = req.body.userid;
   User.findOne({ userid: userid }, (err, user) => {
      user.deleteOne(err => {
         if (err) {
            res.status(500).send('delete error');
            return;
         }
         res.status(200).send('Removed');
         return;
      });
   });
});

async.series([query1, query2, query3, query4, query5, query6], (err, result) => {
   if (err) {
      console.log(err);
   } else {
      console.log('task finished');
   }
});

function query1(callback) {
   // select * from users
   User.find({}, { _id: 0 }).exec(function (err, user) {
      console.log('\nQuery 1');
      console.log(user + '\n');
      callback(null);
   });
}
function query2(callback) {
   // select userid, name, city from users
   User.find({}, { _id: 0, userid: 1, name: 1, city: 1 }).exec(function (err, user) {
      console.log('\nQuery 2');
      console.log(user + '\n');
      callback(null);
   });
}
function query3(callback) {
   // select userid, name, city from users where city='Seoul' order by userid limit3;
   User.find({ city: 'Seoul' }, { _id: 0 })
      .sort({ userid: 1 })
      .limit(3)
      .exec(function (err, user) {
         console.log('\nQuery 3');
         console.log(user + '\n');
         callback(null);
      });
}
function query4(callback) {
   // select userid, name from users where userid='/user/'
   User.find({ userid: { $regex: '100' } }, { _id: 0 })
      .select('userid name')
      .exec(function (err, users) {
         console.log('\nQuery 4');
         console.log(users + '\n');
         callback(null);
      });
}

function query5(callback) {
   // using JSON doc query
   // select userid, name, age from users where city='Seoul' and age > 15 and age < 23
   User.find({ city: 'Seoul', age: { $gt: 14, $lt: 23 } }, { _id: 0 })
      .sort({ age: -1 })
      .select('userid name age')
      .exec(function (err, users) {
         console.log('\nQuery 5');
         console.log(users + '\n');
         callback(null);
      });
}

function query6(callback) {
   // using querybuilder
   // select userid, name, age from users where city='Seoul' and age > 15 and age < 23
   User.find({}, { _id: 0 })
      .where('city')
      .equals('Seoul')
      .where('age')
      .gt(15)
      .lt(23)
      .sort({ age: 1 })
      .select('userid name age')
      .exec(function (err, users) {
         console.log('\nQuery 6');
         console.log(users + '\n');
         callback(null);
      });
}

module.exports = app;
