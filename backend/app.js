const express = require('express')
const app = express()
const mongoose = require('mongoose')
const env = require('dotenv/config')

app.use(express.json())

const UserModel = require('./models/user')
const PartyModel = require('./models/party')

app.get('/home', (req, res) => {
  res.json({
    body: {
      message: "Home API"
    }
  }) 
})

// Adding new party

app.post('/new_party', async (req, res) => {
  const party = new PartyModel({
    invite_code: req.body.invite_code,
    host_id: req.body.host_id,
    party_location: req.body.party_location,
    max_cost: req.body.max_cost,
    party_date: req.body.party_date,
    closing_date: req.body.closing_date
  });

  party.save(function (err, resp) {
    if (err) return res.send(err)
    res.send(resp)
  })
})

// Get party by ID

app.get('/party/:id', async (req, res) => {
  const id = req.params.id;
  const party = await PartyModel.findById(id)

  try {
    res.send(party)
  } catch (err) {
    res.send(err)
  }

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


// Add user

app.post('/add', async (req, res) => {
  const user = new UserModel({
    first_name: req.body.first_name,
    surname_name: req.body.surname_name,
    email: req.body.email,
    date: req.body.date
  });

  user.save(function (err, resp) {
    if (err) return res.send(err)
    res.send(resp)
  })
})

// Add user to a party

app.post('/party/add', async (req, res) => {
  const user = new UserModel({
    first_name: req.body.first_name,
    surname_name: req.body.surname_name,
    email: req.body.email,
    party_id: req.body.party_id
  });

  user.save(function (err, resp) {
    if (err) return res.send(err)
    res.send(resp)
  })
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