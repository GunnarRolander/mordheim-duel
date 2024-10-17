import rolls from './rolls.js'
export default class Combat {
    constructor() { }

    simulateCombat() {
        const weapons = {
            'sword': {
                strength_mod: 0,
                type: "slashing",
                parry: true,
                reroll_parry: false
            }
        }

        const warrior_1 = {
            ws: 3,
            strength: 3,
            toughness: 3,
            attacks: 1,
            wounds: 1,
            initiative: 3,
            status: "standing",
            weapons: [weapons['sword']]
        }

        const warrior_2 = {
            ws: 3,
            strength: 3,
            toughness: 3,
            attacks: 1,
            wounds: 1,
            initiative: 3,
            status: "standing",
            weapons: [weapons['sword']]
        }

        let attacker = warrior_1
        let defender = warrior_2
        let round_number = 1

        this.fightCombatRound(attacker, defender)
        console.log(attacker)
        console.log(defender)
    }

    fightCombatRound(attacker, defender) {
        const to_hit_roll = rolls.rollDice(attacker.attacks)
        const hits = to_hit_roll.filter((roll) => roll >= rolls.toHit(attacker.ws, defender.ws)).length
        if (hits == 0) {
            return
        }
        const to_wound_roll = this.rolls.rollDice(hits)
        const crit = to_wound_roll.some((roll) => roll == 6) && rolls.ableToCrit(attacker.strength, defender.toughness)
        const wounds = to_wound_roll.filter((roll) => roll >= rolls.toWound(attacker.strength, defender.toughness)).length
        if (wounds == 0) {
            return
        }
        if (wounds >= defender.wounds) {
            const injuries = wounds - defender.wounds + 1
            const injury_rolls = rolls.rollDice(injuries)
            const highest_injury_roll = Math.max(injury_rolls)
            defender.status = rolls.injury(highest_injury_roll)
        }
        defender.wounds -= wounds
        if (defender.wounds < 0) defender.wounds = 0
        console.log(attacker)
        console.log(defender)
    }
}

const instance = new Combat();
export { instance as Combat };