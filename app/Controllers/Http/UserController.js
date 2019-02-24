'use strict'

/* global use */

const User = use('App/Models/User')
const Confirm = use('App/Models/Confirm')
const { validate } = use('Validator')
const Mail = use('Mail')
const crypto = use('crypto')
const Env = use('Env')
const Logger = use('Logger')
const Log = use('App/Helpers/Logs')
const Encryption = use('Encryption')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async index ({ request, response, view }) {
  // }

  /**
   * Login a user and return jwt token.
   * POST users/login
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login ({ auth, request, response }) {
    const { email, password } = request.all()

    const result = await auth.withRefreshToken().attempt(email, password)
    await Logger.info(result)
    try {
      const result = await auth.withRefreshToken().attempt(email, password)
      const user = await User.findByOrFail('email', email)
      if (user.banned) {
        // revoke all tokens
        await auth.scheme('jwt').revokeTokens()
        return response.status(401).json({
          message: 'You are banned from this site. Contact admin.'
        })
      }

      await Log('info', 'User Login', user.id, null, `${user.username} - ${email}`, null)
      await Logger.info(`User Login: ${user.id} - ${user.username} - ${email}`)
      return response.status(200).json(result)
    } catch (errors) {
      // console.log(errors)
      errors.email = email
      await Logger.error(`User Login: Failed => ${errors.email} - ${errors}`)
      return response.status(401).json({
        message: "Darn! Can't authorise you with those details."
      })
    }
  }

  /**
   * Logout a user and delete the refresh tokens in the database.
   * POST users/logout
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async logout ({ auth, response }) {
    const header = await auth.getAuthHeader()
    const decodedHeader = Encryption.base64Decode(header.split('.')[1])
    const userToken = JSON.parse(decodedHeader)
    const user = await User.find(userToken.uid)
    await user
      .tokens()
      .where('user_id', userToken.uid)
      .delete()
    return response.send('success')
  }

  /**
   * Check username exist for signup.
   * GET username
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async checkUsername ({ request, response }) {
    let exist = await User.findBy('username', request.input('username'))
    return response.send(!!exist)
  }

  /**
   * Check e-mail exist for signup.
   * GET e-mail
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async checkEmail ({ request, response }) {
    let exist = await User.findBy('email', request.input('email'))
    return response.send(!!exist)
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async create ({ request, response, view }) {
  // }

  /**
   * Create confirm token for validation of e-mail address
   * POST users
   *
   * @param {object} ctx
   */
  async createConfirmToken ({ user }) {
    const hmac = crypto.createHmac('sha256', Env.get('APP_KEY'))
    hmac.update(user.email)
    let token = hmac.digest('hex')
    try {
      // valid token 3 days
      await Confirm.create({
        user_id: user.id,
        token: token,
        valid: 259200,
        type: 1
      })
      return token
    } catch (err) {
      await logger('error', 'Register - Create Confirm Token Error', user.id, user.email, err)
    }
  }

  /**
   * Get new jwt token by users refresh token.
   * POST users/refreshToken
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async refreshToken ({ auth, request, response }) {
    try {
      const params = request.only(['refreshToken'])
      const header = await auth.getAuthHeader()
      const decodedHeader = Encryption.base64Decode(header.split('.')[1])
      const jwtToken = JSON.parse(decodedHeader)
      const user = await User.find(jwtToken.uid)
      const jwt = await auth.newRefreshToken().generateForRefreshToken(params.refreshToken, true)
      const refreshUser = {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
      return response.send(refreshUser)
    } catch (err) {
      await logger('error', 'refreshJWTToken - Error', auth.id, auth.email, err)
    }
  }

  /**
   * Confirm the e-mail with confirm token
   * POST users/refreshToken
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async confirmAccount ({ request, response }) {
    try {
      let confirm = await Confirm.findBy('token', request.input('token'))
      if (confirm.created_at.unix() + confirm.valid > Math.round(+new Date() / 1000)) {
        // Set user to active
        await User
          .query()
          .where('id', confirm.user_id)
          .update({
            active: true
          })

        // Delete confirm token in database
        await Confirm
          .query()
          .where('id', confirm.id)
          .delete()

        await logger('info', 'ConfirmAccount - UserID', confirm.user_id, null, null)
        return response.send('Confirm your E-Mail successfully')
      } else {
        await logger('info', 'ConfirmAccount - Link expired - UserID', confirm.user_id, null, null)
        return response.send('Confirm Link expired!')
      }
    } catch (err) {
      await logger('error', 'ConfirmAccount - Confirm Token not found', null, request.input('token'), null)
      return response.send('Confirm Token not found!')
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const data = request.only(['username', 'email', 'password', 'password_confirmation'])
    data['active'] = true
    const validation = await validate(data,
      {
        username: 'required|unique:users',
        email: 'required|email|unique:users',
        password: 'required|strongPassword',
        password_confirmation: 'required_if:password|same:password'
      },
      {
        'username.required': 'Please fill in the Username',
        'username.unique': 'Username has already been taken by someone else',
        'email.required': 'Mailbox cannot be empty',
        'email.email': 'Incorrect email format',
        'email.unique': 'E-Mail already exist',
        'password.required': 'Please fill in the password',
        'password.strongPassword': 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      })

    if (validation.fails()) {
      await Log('error', 'Register - Validation Form fails', null, null, `${data.username} - ${data.email} - ${validation.messages()}`)
      await Logger.error(`Register - Validation Form fails - ${data.username} - ${data.email}`)
      return response.send(validation.messages())
    }

    // Deleting the confirmation field since we don't want to save it
    delete data.password_confirmation

    /**
     * Creating a new user into the database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_create
     */
    try {
      const user = await User.create(data)
      if (Env.get('ACCOUNT_CONFIRM', 'true') === 'true') {
        const token = await this.createConfirmToken(user)
        const verify = {
          domain: Env.get('MAIL_URL', '127.0.0.1:3333'), token: encodeURI(token)
        }
        await Mail.send('emails.confirmMail', {
          user: user.toJSON(),
          verify: verify
        }, (message) => {
          message
            .to(user.email)
            .from(Env.get('MAIL_FROM'), Env.get('MAIL_FROM_NAME'))
            .subject(Env.get('MAIL_SUBJECT'))
        })
        await Log('info', 'Register - Send Mail to confirm', user.id, null, `${user.username} - ${user.email}`)
        await Logger.info(`Register - Send Mail to confirm - ${user.username} - ${user.email}`)
        return response.send(true)
      } else {
        // user.active = true
        // await user.save()
        const jwt = await auth.withRefreshToken().generate(user, true)
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email
        }

        await Log('info', 'Register - User created without confirm mail', user.id, null, `${user.username} - ${user.email}`)
        await Logger.info(`Register - User created without confirm mail - ${user.username} - ${user.email}`)
        return response.send({
          jwt, user: userInfo
        })
      }
    } catch (err) {
      await Log('error', 'Register - Send Mail Error', auth.id, null, `${auth.username} - ${auth.email} - ${err}`)
      await Logger.error(`Register - Send Mail Error - ${auth.username} - ${auth.email}  - ${err}`)
      return response.send(err)
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async show ({ params, request, response, view }) {
  // }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async edit ({ params, request, response, view }) {
  // }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async update ({ params, request, response }) {
  // }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async destroy ({ params, request, response }) {
  // }
}

module.exports = UserController
