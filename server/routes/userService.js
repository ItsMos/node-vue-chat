import { Router } from "express"
import bcryptjs from "bcryptjs"
import db from '../db.js'
import jwt from "jsonwebtoken"

// env vars are not parsed instantly
let secret
setTimeout(() => {secret = process.env.secret}, 0)

const router = Router()

router.post('/apiRegister', async (req, res)=> {
  const { user, pass } = req.body

  if (db.getUser(user)) {
    res.status(403).json({error: 'Already registered'})

  } else {
    if (user && user.length >= 3 && pass && pass.length >= 8) {
      if (/^([a-z]|[A-Z]|_|-|\d){3,}$/.test(user)) {
        db.newUser(user, await bcryptjs.hash(pass, 6))
        console.log('Registered username: '+user)
        let token = jwt.sign({
          user
        }, secret)
        res.json({token})

      } else {
        res.status(403).json({error: 'Invalid username'})
      }

    } else if (!user || user.length < 3) {
      res.status(403).json({error: 'Username must be 3 or more characters long'})

    } else if (!pass || pass.length < 8) {
      res.status(403).json({error: 'Password must be 8 or more characters long'})
    }
  }
  res.end()
})

router.post('/apiLogin', (req, res)=> {
  const { user, pass } = req.body

  let hash = db.getUser(user)?.password
  if (hash) {
    if (bcryptjs.compareSync(pass, hash)) {
      let token = jwt.sign({
        user
      }, secret)
      res.json({token})

    } else {
      res.status(403).json({error:'Wrong password'})
    }
  } else {
    res.status(403).json({error: 'Unkown username'})
  }
  res.end()
})

export default router
