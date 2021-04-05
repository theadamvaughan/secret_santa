const express = require('express')
const app = express()
const mongoose = require('mongoose')
const env = require('dotenv/config')
const UserModel = require('./models/user')
const PartyModel = require('./models/party')
const bodyParser = require('body-parser')

app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.set('view engine', 'ejs')


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function find_party_id() {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params._id;
  var o_id = new ObjectId(id);
  db.parties.find({_id:o_id})
}

function create_date(date, time) {
  // This expects a date to be YYYY-MM-DD
  // This expects a time of HH:MM
  var date = new Date(date + 'T' + time + ':00Z');
  return date
}

function get_date(date) {
  var full_date = date.toDateString();
  return full_date
}

function get_time(date) {
  var hour = date.getHours();
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return hour + ':' + minutes;
}

app.get('/test', function (req, res) {
  res.send(create_date("2001-12-12","20:00"))
})

// ............................... Web App Code .................................

// ......... Home web page

app.get('/', function (req, res) {
  res.render('index')
})

// ......... New party creation page

app.get('/party/new_party', function (req, res) {
  res.render('new_party')
})

// ......... Posting new party info to the database

app.post('/party/new_party', (req, res) => {
  const newUserID = create_UUID()
  const newPartyID = create_UUID()
  console.log(req.body);
  // Make a new user
  const user = new UserModel({
    user_id: newUserID,
    first_name: req.body.first_name,
    surname: req.body.surname,
    email_address: req.body.email_address,
    party_id: newPartyID,
  });
  // makes new party
  const party = new PartyModel({
    party_id: newPartyID,
    party_location: req.body.party_location,
    max_cost: req.body.max_cost,
    party_date: create_date(req.body.party_date, req.body.party_start_time),
    closing_date: create_date(req.body.reg_closing_date, req.body.reg_closing_time),
    host_id: newUserID,
  });

  user.save((err, dbResponse) => {
    if (err) {
      console.log('ERROR!')
      console.log(err)
    } else {
      party.save((err, dbResponse) => {
        if (err) {
          console.log('ERROR!')
          console.log(err)
        } else {
          console.log('New party save confirmed')
          // res.send('Success! ' + party.party_id)
          res.redirect(`/party/party_created/${party.party_id}`)
        }
      })
    }
  })
})

// .......... Party created

app.get('/party/party_created/:party_id', async (req, res) => {
  const party = await PartyModel.findOne({party_id: req.params.party_id});
  const host = await UserModel.findOne({user_id: party.host_id });
  const date = await PartyModel.findOne({party_date: req.params.party_date})

  res.render('party_created', {party: party, hostname: host.first_name + ' ' + host.surname, date: date, party_code: party.party_id})
})



// ......... Join party page

app.get('/party/invite/:party_id', async (req, res) => {
  const party = await PartyModel.findOne({party_id: req.params.party_id});
  const host = await UserModel.findOne({user_id: party.host_id });
  const date = await PartyModel.findOne({party_date: req.params.party_date})

  res.render('join_party', {party: party, hostname: host.first_name + ' ' + host.surname, date: date, party_code: party.party_id})
})

// Post to this route to add a new user to the party.

app.post('/party/invite/:party_id', async (req, res) => {
  const party = await PartyModel.findOne({ party_id: req.params.party_id });
  console.log(req.params.party_id)
  const newUserID = create_UUID();
  const user = new UserModel({
    user_id: newUserID,
    first_name: req.body.first_name,
    surname: req.body.surname,
    email_address: req.body.email_address,
    party_id: party.party_id,
  });

  user.save((err, dbResponse) => {
    if (err) {
      console.log('ERROR!')
      console.log(err)
    } else {
      console.log('User save confirmed')
      res.redirect(`/party/party_joined/${party.party_id}`)
    }
  })
})

// ......... Party Joined confirmation page

app.get('/party/party_joined/:party_id', async (req, res) => {
  
  const party = await PartyModel.findOne({party_id: req.params.party_id});
  const host = await UserModel.findOne({user_id: party.host_id });
  const date = await PartyModel.findOne({ party_date: req.params.party_date });

  var party_date = get_date(party.party_date);
  var party_time = get_time(party.party_date);
  var closing_date = get_date(party.closing_date);
  var closing_time = get_time(party.closing_date);


  res.render('party_joined', {party: party, hostname: host.first_name + ' ' + host.surname, party_date: party_date, party_time: party_time, closing_date: closing_date, closing_time: closing_time})
})







// Find all parties

app.get('/parties', async (req, res) => {
  const party = await PartyModel.find()

  try {
    res.send(party)
  } catch (err) {
    res.send(err)
  }
})

// Find all users

app.get('/all', async (req, res) => {
  const users = await UserModel.find()

  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }
})

// Find user by ID

app.get('./user/:id', async (req, res) => {
  const id = req.params.id;
  const users = await UserModel.findById(id)

  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }

})

// Delete user by ID

app.delete('/user/:id', async (req, res) => {
  const id = req.params.id;
  const deletedUser = await UserModel.deleteOne({
    _id: id
  })

  try {
    res.send(deletedUser)
  } catch (err) {
    res.send(err)
  }

})

// Update user by ID

app.patch('/user/:id', async (req, res) => {
  const id = req.params.id;
  const update = await UserModel.update(
    { _id: id },
    {
      $set: req.body
    }
  )

  try {
    res.send(update)
  } catch (err) {
    res.send(err)
  }
})

// Start up messages

app.listen(process.env.PORT, () => {
  console.log('Server is running')
}
)

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) return console.log(err.message)
  console.log('Database Connected')
})
