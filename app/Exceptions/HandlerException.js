'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class HandlerException extends LogicalException {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response, session, view }) {
    // JWT Token expired
    if (error.code === 'E_JWT_TOKEN_EXPIRED') {
      return response.status(266).send('need_refresh_jwt_token')
    }
    if (error.code === 'EBADCSRFTOKEN') {
      response.forbidden('Cannot process your request.')
      return
    }

    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {}
}

module.exports = HandlerException
