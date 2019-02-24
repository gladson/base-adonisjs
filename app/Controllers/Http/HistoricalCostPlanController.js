'use strict'

const HistoricalCostPlan = use('App/Models/HistoricalCostPlan')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with historicalcostplans
 */
class HistoricalCostPlanController {
  /**
   * Show a list of all historicalcostplans.
   * GET historicalcostplans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const data = HistoricalCostPlan.all()
    return data
  }

  /**
   * Create/save a new historicalcostplan.
   * POST historicalcostplans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['user_id', 'flat_rate_id', 'plan', 'with_plan', 'no_plan'])
    response.status(201)
    return HistoricalCostPlan.create(data)
  }

  /**
   * Display a single historicalcostplan.
   * GET historicalcostplans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const data = await HistoricalCostPlan.findOrFail(params.id)
    return data
  }

  /**
   * Update historicalcostplan details.
   * PUT or PATCH historicalcostplans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = await HistoricalCostPlan.findOrFail(params.id)
    data.merge(request.only(['user_id', 'flat_rate_id', 'plan', 'with_plan', 'no_plan']))
    await data.save()
    return data
  }

  /**
   * Delete a historicalcostplan with id.
   * DELETE historicalcostplans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const data = await HistoricalCostPlan.findOrFail(params.id)
    await data.delete()
    response.status(204).send()
  }
}

module.exports = HistoricalCostPlanController
