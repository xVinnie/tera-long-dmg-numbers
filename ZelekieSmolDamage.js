module.exports = function ZelekieSmolDmg(d) {

const dmgType = 1 
const divisor = 10000 // tis makes the dmg smoller

  d.hook('S_EACH_SKILL_RESULT', 12, event => {
    if ((d.game.me.is(event.source) || d.game.me.is(event.owner)) && event.type == dmgType) {
      event.damage = Math.round(event.damage / divisor)
      return true
    }
  })
}