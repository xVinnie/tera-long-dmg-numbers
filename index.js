module.exports = function ZelekieShortDmgNumbers(mod) {

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

  const dmgType = 1,
    settings = require(`./settings.json`)

  mod.hook('S_EACH_SKILL_RESULT', 12, event => {
    if (settings.enabled && (mod.game.me.is(event.source) || mod.game.me.is(event.owner)) && event.type == dmgType) {
      event.damage = Math.round(event.damage / settings.divisor)
      return true
    }
  })

  mod.command.add('smn', {
    on() {
      if (!settings.enabled) {
        settings.enabled = true
        mod.command.message('Module enabled.')
      }
      else mod.command.message('Fool, i was already enabled!')
    },
    off() {
      if (settings.enabled) {
        settings.enabled = false
        mod.command.message('Module disabled.')
      }
      else mod.command.message('Fool, i was already disabled!')
    },
    divisor(NewValue) {
      settings.divisor = NewValue
      mod.command.message('New settings.divisor set to: ' + settings.divisor + '.')
    }
  })
}
