'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use('App/Models/User')

const usersSeedData = require('../seed-data/Users')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    for (let user of usersSeedData) {
      await User.create(user)
    }
    console.log('Seeded Users')
  }
}

module.exports = UserSeeder
