'use strict'
/* global use */

const LoggerSystem = use('Logger')

/**
 * Log Custom
 * Level: emergency, alert, critical, error, warning, notice, info, debug
 *
 * Example: await Log('info', 'User Login', user.id, null, email, null)
 *
 * @param {object} (level, event, userId = null, tabelaNome = null, tabelaId = null, description)
 *
 */
async function Logger (level, event, userId = null, tabelaNome = null, tabelaId = null, description = null) {
  const LogModel = use('App/Models/Log')
  const log = new LogModel()
  log.user_id = userId
  log.level = level.toUpperCase()
  log.event = event.toUpperCase()
  log.tabela_nome = tabelaNome
  log.tabela_id = tabelaId
  log.description = ((typeof description === 'object') && (description !== null)) ? JSON.stringify(description) : description
  await log.save()

  const userIdTrace = !userId ? '' : `- UserID(${userId})`
  const tabelaNomeTrace = !tabelaNome ? '' : `- Tebela(${tabelaNome})`
  const tabelaIdTrace = !tabelaId ? '' : `- TabelaID(${tabelaId})`
  const descriptionTrace = !description ? '' : `- Descricao(${description})`
  const messageLoogerSystem = `${event} ${userIdTrace} ${tabelaNomeTrace} ${tabelaIdTrace} ${descriptionTrace}`

  switch (level) {
    case 'error':
      await LoggerSystem.error(messageLoogerSystem)
      break
    case 'emergency':
      await LoggerSystem.emerg(messageLoogerSystem)
      break
    case 'alert':
      await LoggerSystem.alert(messageLoogerSystem)
      break
    case 'critical':
      await LoggerSystem.crit(messageLoogerSystem)
      break
    case 'warning':
      await LoggerSystem.warning(messageLoogerSystem)
      break
    case 'notice':
      await LoggerSystem.notice(messageLoogerSystem)
      break
    case 'info':
      await LoggerSystem.info(messageLoogerSystem)
      break
    case 'debug':
      await LoggerSystem.debug(messageLoogerSystem)
      break
  }
}

module.exports = Logger
