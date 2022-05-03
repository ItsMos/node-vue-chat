import { readFileSync, writeFileSync } from 'fs'

let db = readFileSync('./db.json')
db = JSON.parse(db)


function saveFile() {
  console.log('saving')
  writeFileSync('./db.json', JSON.stringify(db, null, 2), 'utf-8')
}

export default {
  getUser(username) {
    return db.users[username]
  },

  newUser(username, password) {
    let user = db.users[username] = {
      password
    }
    saveFile()
    return user
  },

  set(key, val) {
    db[key] = val
    saveFile()
    return
  }
}
