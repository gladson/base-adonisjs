'use strict'

// const User = use('App/Models/User')
const FlatRate = use('App/Models/FlatRate')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with flatrates
 */
class FlatRateController {
  /**
   * Show a list of all flatrates.
   * GET flatrates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const data = FlatRate.all()
    return data
  }

  /**
   * Create/save a new flatrate.
   * POST flatrates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['user_id', 'ddd_origin_id', 'ddd_destiny_id', 'rate'])
    response.status(201)
    return FlatRate.create(data)
  }

  /**
   * Display a single flatrate.
   * GET flatrates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const data = await FlatRate.findOrFail(params.id)
    return data
  }

  /**
   * Update flatrate details.
   * PUT or PATCH flatrates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = await FlatRate.findOrFail(params.id)
    data.merge(request.only(['user_id', 'ddd_origin_id', 'ddd_destiny_id', 'rate']))
    await data.save()
    return data
  }

  /**
   * Delete a flatrate with id.
   * DELETE flatrates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const data = await FlatRate.findOrFail(params.id)
    await data.delete()
    response.status(204).send()
  }
}

module.exports = FlatRateController
