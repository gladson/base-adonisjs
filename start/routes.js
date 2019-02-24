'use strict'

/* global use */
/* eslint no-undef: "error" */

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.resource('ddd', 'OriginAndDestinyController').apiOnly()
  Route.resource('tariff', 'FlatRateController').apiOnly()
  Route.resource('costplans', 'HistoricalCostPlanController').apiOnly()
}).prefix('api/v1').middleware('auth')

// Account Public Routes
Route.group(() => {
  Route.post('login', 'UserController.login')
  Route.post('logout', 'UserController.logout')
  Route.post('refreshToken', 'UserController.refreshToken')
  Route.post('register', 'UserController.store')
  Route.post('checkUsername', 'UserController.checkUsername')
  Route.post('checkEmail', 'UserController.checkEmail')
  Route.post('confirm', 'UserController.confirmAccount')
}).prefix('api/v1')
