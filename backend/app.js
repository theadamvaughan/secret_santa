const express = require('express')
const app = express()
const mongoose = require('mongoose')
const env = require('dotenv/config')
const UserModel = require('./models/user')
const PartyModel = require('./models/party')
app.use(express.json())


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


app.get('/home', (req, res) => {
  res.json({
    body: {
      message: "Home API"
    }
  })
})

// Adding new party

app.post('/new_party', async (req, res) => {
  const newUserID = create_UUID()
  const newPartyID = create_UUID()

  // Make a new user
  const user = new UserModel({
    user_id: newUserID,
    first_name: req.body.first_name,
    surname: req.body.surname,
    email: req.body.email_address,
    party_id: newPartyID,
  });
  // makes new party
  const party = new PartyModel({
    party_id: newPartyID,
    party_location: req.body.party_location,
    max_cost: req.body.max_cost,
    party_date: Date.parse(req.body.party_date),
    closing_date: Date.parse(req.body.closing_date),
    host_id: newUserID
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
          res.send('Success! ' + party.party_id)
        }
      })
    }
  })
})

// Get party by ID

// NEED TO GET THIS TO FIND BY INVITE IN THE URL..................................

// https://secretsanta.com/party/3333-3333-3333-3333

app.get('/party/invite/:party_id', async (req, res) => {
  const party = await PartyModel.findOne({party_id: req.params.party_id});
  console.log(party)
  // Show them a web page containing
  //  - The party details
  //  - A form to join the party
  res.send('This is the party page for party with location ' + party.party_location)
})

// Post to this route to add a new user to the party.
app.post('/party/invite/:party_id', async (req, res) => {
  const newUserID = create_UUID()

  const user = new UserModel({
    user_id: newUserID,
    first_name: req.body.first_name,
    surname: req.body.surname,
    email: req.body.email_address,
    party_id: req.params.party_id,
  });

  user.save((err, resp) => {
    if (err) {
      console.log('ERROR!')
      console.log(err)
    } else {
      console.log('User save confirmed')
      res.send(user)
    }
  })
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


app.listen(3000, () => {
  console.log('Server is running')
}
)

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) return console.log(err.message)
  console.log('Database Connected')
})
