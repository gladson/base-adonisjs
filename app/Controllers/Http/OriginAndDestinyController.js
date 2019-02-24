'use strict'
/* global use */
const Antl = use('Antl')

const { isEmpty } = use('App/Helpers/isEmpty')
const Log = use('App/Helpers/Logs')
const OriginAndDestiny = use('App/Models/OriginAndDestiny')
const User = use('App/Models/User')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with originanddestinies
 */
class OriginAndDestinyController {
  /**
   * Show a list of all originanddestinies.
   * GET originanddestinies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const data = await OriginAndDestiny.all()
      if (isEmpty(data) === true) {
        return data
      } else {
        const msgGeneralExists = Antl.formatMessage('messages.general_204')
        await Log('error', msgGeneralExists, null, 'origin_and_destinies', null, null)
        return response.status(400).json({
          message: msgGeneralExists
        })
      }
    } catch (error) {
      const msgGeneralExists = Antl.formatMessage('messages.general_exists', { name: 'DDD' })
      await Log('error', msgGeneralExists, null, 'origin_and_destinies', null, !error ? null : error)
      return response.status(400).json({
        message: msgGeneralExists
      })
    }
  }

  /**
   * Create/save a new originanddestiny.
   * POST originanddestinies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['ddd'])
    response.status(201)
    return OriginAndDestiny.create(data)
  }

  /**
   * Display a single originanddestiny.
   * GET originanddestinies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const data = await OriginAndDestiny.findOrFail(params.id)
    return data
  }

  /**
   * Update originanddestiny details.
   * PUT or PATCH originanddestinies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = await OriginAndDestiny.findOrFail(params.id)
    data.merge(request.only(['ddd']))
    await data.save()
    return data
  }

  /**
   * Delete a originanddestiny with id.
   * DELETE originanddestinies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const data = await OriginAndDestiny.findOrFail(params.id)
    await data.delete()
    response.status(204).send()
  }
}

module.exports = OriginAndDestinyController
