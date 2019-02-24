'use strict'
/* global use */
/* eslint no-undef: "error" */

const Model = use('Model')

class Log extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Log
