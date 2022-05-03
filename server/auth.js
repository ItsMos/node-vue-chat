import jwt from "jsonwebtoken"

// env vars are not parsed instantly
let secret
setTimeout(() => {secret = process.env.secret}, 0)

export default async (req, res, next)=> {
  let token = req.headers.authorization
  if (token) {
    try {
      let res = await jwt.verify(token, secret)
      req.body.user = res.user
      next()

    } catch (error) {
      res.redirect('/')
    }

  } else {
    res.redirect('/')
  }
}
