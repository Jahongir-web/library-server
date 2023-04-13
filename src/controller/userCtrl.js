const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const User = require('../model/userModel')


const userCtrl = {
  // register new user
  registerUser: async (req, res) => {
    const {name, email, password} = req.body

    try {
      const oldUser = await User.findOne({email})
      if(oldUser) {
        return res.status(400).send({message: "User already exists!"})
      }      
      const hashedPassword = await bcrypt.hash(password, 10)
      req.body.password = hashedPassword
      const newUser = new User(req.body)
      await newUser.save()     

      const token = JWT.sign({name, email, id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

      res.status(201).send({message: "User signup successfully", token, newUser: {name, email, id: newUser._id, phone: newUser.phone}})

    } catch (error) {
      res.status(500).send({message: error.message})
    }
  },

  // login user
  loginUser: async (req, res) => {
    const {email, password} = req.body
    
    try {
      const user = await User.findOne({email})
      if(user) {
        const validaty = await bcrypt.compare(password, user.password)
        if(!validaty) {
          return res.status(400).send({message: "wrong email or password"})
        }
        const token = JWT.sign({name: user.name, email, id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        return res.status(200).send({message: "login success", token, user})
      }

      res.status(404).send({message: "User not found!"})
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  }
}

module.exports = userCtrl