const express = require('express')
const app = express()

const mongoose = require('mongoose')
const env = require('dotenv/config')

app.use(express.json())

const UserModel = require('../models/user')
const PartyModel = require('../model/party')

router.get('/home', (req, res) => {
  res.json({
    body: {
      message: "Home API"
    }
  })
})

router.post('/add', async (req, res) => {
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  user.save(function (err, resp) {
    if (err) return res.send(err)
    res.send(resp)
  });
})


router.get('/all', async (req, res) => {
  const users = await UserModel.find()

  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }
})


router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  const users = await UserModel.findById(id)

  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }

})

router.delete('/user/:id', async (req, res) => {
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

router.patch('/user/:id', async (req, res) => {
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


app.listen(3000, () => {
  console.log('Server is running')
}
)

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) return console.log(err.message)
  console.log('Database Connected')
})
