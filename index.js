module.exports = function ZelekieLongDmgNumbers(mod) {

  // Ponku told me to put this here
  if (mod.proxyAuthor !== 'caali') {
    const options = require('./module').options
    if (options) {
      const settingsVersion = options.settingsVersion
      if (settingsVersion) {
        mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
        mod.settings._version = settingsVersion
      }
    }
  }

  const dmgType = 1 // We assume other dmg types are irrelevant, might not be true.

  // GameId for ponku's broxy
  let me = null
  mod.hook('S_LOGIN', 10, event => { me = event.gameId }) // if notCaali ==>...

  // Hook packet responsible for dmg, check wherever it's relative to us, modify it if so
  mod.hook('S_EACH_SKILL_RESULT', 12, event => {
    if (!mod.settings.enabled) return
    if ((me === event.source || me === event.owner) && event.type === dmgType) {
      event.damage = event.damage / BigInt(mod.settings.multiplier)
      return true
    }
  })

  // Bunch of useless commands
  mod.command.add('lmn', {
    on() {
      if (mod.settings.enabled) return mod.command.message('Fool, i was already enabled!')
      mod.settings.enabled = true
      mod.command.message('Module enabled.')
    },
    off() {
      if (!mod.settings.enabled) return mod.command.message('Fool, i was already disabled!')
      mod.settings.enabled = false
      mod.command.message('Module disabled.')
    },
    multiplier(NewValue) {
      if (!+NewValue) return mod.command.message('Innapropiate or missing multiplier value.')
      mod.settings.multiplier = NewValue
      mod.command.message('Multiplier set to: ' + mod.settings.multiplier + '.')
    },
    $default() { mod.command.message('Invalid command.') }
  })
}
