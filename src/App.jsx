import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  function getRandomInt(min, max) {
    // Create byte array and fill with 1 random number
    var byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);

    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
        return getRandomInt(min, max);
    return min + (byteArray[0] % range);
}

  const rollDice = function (number_of_dice) {
    const dice_results = []
    for (let i = 0; i < number_of_dice; i++) {
        dice_results.push(getRandomInt(1, 6))
    }
    return dice_results
  }

  const toHit = function (attacker_ws, defender_ws) {
      if (attacker_ws > defender_ws) {
          return 3
      }
      if (defender_ws > attacker_ws * 2) {
          return 5
      }
      return 4

  }

  const toWound = function (strength, toughness) {
      let target_value = 4
      if (strength == toughness + 1) {
          target_value = 3
      }
      if (strength >= toughness + 2) {
          target_value = 2
      }
      if (strength == toughness - 1) {
          target_value = 5
      }
      if (strength == toughness - 2) {
          target_value = 6
      }
      if (strength == toughness - 3) {
          target_value = 6
      }
      if (strength <= toughness - 4) {
          target_value = 7
      }

      return target_value
  }

  const ableToCrit = function (strength, toughness) {
      return strength >= toughness - 1
  }

  const getCrit = function (dice_roll) {
      const d3 = Math.round(dice_roll/2)
      switch (d3) {
        case 1:
          return [false, 1, 0]
        case 2:
          return [true, 1, 0]
        case 3:
          return [true, 1, 2]
      }
      return [false, 0, 0]
  }

  const armour_save = function (attacker_strength, armour_save) {
    const ap = attacker_strength > 3 ? attacker_strength - 3 : 0
    const armour_save_target = armour_save + ap
    return armour_save_target
  }

  const injury = function (injury_roll) {
      if (injury_roll == 1 || injury_roll == 2) {
          return "knocked down"
      }
      if (injury_roll == 3 || injury_roll == 4) {
          return "stunned"
      }
      if (injury_roll >= 5) {
          return "out of action"
      }
      console.log("injury_roll: " + injury_roll + " is not valid")
      return "bugged"
  }

  const do_recovery = function (warrior) {
    if (warrior.status == "knocked down") {
        warrior.status = "standing"
        warrior.stood_up = true
    }
    if (warrior.status == "stunned") {
        warrior.status = "knocked down"
    }
  }

  const who_strikes_first = function (warrior_1, warrior_2) {
    if (warrior_1.charger || warrior_2.charger) {
      if (warrior_1.charger) {
        warrior_1.charger = false
        return [warrior_1, warrior_2]
      } else {
        warrior_2.charger = false
        return [warrior_2, warrior_1]
      }
    } else if (warrior_1.stood_up || warrior_2.stood_up) {
      if (warrior_2.stood_up) {
        warrior_2.stood_up = false
        return [warrior_1, warrior_2]
      } else {
        warrior_1.stood_up = false
        return [warrior_2, warrior_1]
      }
    } else if (warrior_1.initiative > warrior_2.initiative) {
      return [warrior_1, warrior_2]
    } else if (warrior_2.initiative > warrior_1.initiative) {
      return [warrior_2, warrior_1]
    } else {
      if (rollDice(1)[0] >= 4) {
        return [warrior_1, warrior_2]
      } else {
        return [warrior_2, warrior_1]
      }
    }
  }

  const simulateCombat = function (warrior_1_base, warrior_2_base) {
    const debug = true
    // const warrior_1 = {...warrior_1_base}
    // const warrior_2 = {...warrior_2_base}

    const warrior_1 = JSON.parse(JSON.stringify(warrior_1_base))
    const warrior_2 = JSON.parse(JSON.stringify(warrior_2_base))

    let attacker = warrior_1
    let defender = warrior_2
    let round_number = 0
    let fight_done = false
    const fight_log = []

    while (!fight_done) {
      round_number += 1
      // Recovery phase
      if (round_number % 2 == 0) {
        do_recovery(warrior_2)
      } else  {
        do_recovery(warrior_1)
      }
      [attacker, defender] = who_strikes_first(warrior_1, warrior_2)

      const attackers_round = attacker.status == "standing" ? fightCombatRound(attacker, defender) : {}
      const defenders_round = defender.status == "standing" ? fightCombatRound(defender, attacker) : {}
      if (debug) console.log("End of round statuses", warrior_1.status, warrior_2.status, "fight done?", warrior_1.status == "out of action" || warrior_2.status == "out of action")
      if (warrior_1.status == "out of action" || warrior_2.status == "out of action") {
        fight_done = true
        // console.log("Fight over in round " + round_number)
      }

      fight_log.push({'round': round_number, 'attacker_round': attackers_round, 'defender_round': defenders_round, w1s: warrior_1.status, w2s: warrior_2.status, attacker: attacker.name, defender: defender.name})
    }
    console.log(fight_log)
    const winner = warrior_1.status == "out of action" ? warrior_2 : warrior_1
    return [winner, round_number]
}

  const fightCombatRound = function (attacker, defender) {
    const debug = true
    let main_weapon = attacker.weapons[0]
    let offhand_weapon = attacker.weapons[1]

    if (debug) console.log("weapons", main_weapon, offhand_weapon)

    let main_hits = 0
    let offhand_hits = 0
    let main_to_hit_roll = []
    let offhand_to_hit_roll = []
    let parry_roll = []
    if (defender.status == "knocked down" || defender.status == "stunned") {
        main_hits = attacker.attacks
        main_to_hit_roll = ['auto hit']
        if (debug) console.log("main to hit, hits", main_to_hit_roll, main_hits)

        if (offhand_weapon) {
          offhand_to_hit_roll = ['auto hit']
          offhand_hits = 1
          if (debug) console.log("offhand to hit, hits", offhand_to_hit_roll, offhand_hits)
        }
    } else {
      main_to_hit_roll = rollDice(attacker.attacks)
      main_hits = main_to_hit_roll.filter((roll) => roll >= toHit(attacker.ws, defender.ws)).length

      if (debug) console.log("main to hit, hits", main_to_hit_roll, main_hits)

      offhand_to_hit_roll = offhand_weapon ? rollDice(1) : []
      offhand_hits = offhand_to_hit_roll.filter((roll) => roll >= toHit(attacker.ws, defender.ws)).length

      if (debug) console.log("offhand to hit, hits", offhand_to_hit_roll, offhand_hits)

      const parry_weapons = defender.weapons.filter((weapon) => weapon.tags.includes('parry'))
      const parry_armour = defender.armour.filter((armour) => armour.tags.includes('parry'))
      if (debug) console.log("parry equipment", parry_weapons, parry_armour)

      const combined_parry_equipment = [...parry_weapons, ...parry_armour]
      const combined_hit_roll = [...main_to_hit_roll, ...offhand_to_hit_roll]
      const max_hit_roll = Math.max(...combined_hit_roll)
      if (debug) console.log("max hit roll", max_hit_roll)

      // If the defender has at least one weapon or armour with the parry tag, allow parry
      if (debug) console.log("parry conditions", combined_parry_equipment.length > 0, max_hit_roll != 6, !combined_hit_roll.includes('auto hit'))
      if (combined_parry_equipment.length > 0 && max_hit_roll != 6 && !combined_hit_roll.includes('auto hit')) {
        // If the defender has more than two weapons or armours with the parry tag, check for reroll parry tag and roll 2 dice
        parry_roll = combined_parry_equipment.length > 1 && combined_parry_equipment.some((eq) => eq.tags.includes('reroll parry')) ? Math.max(...rollDice(2)) : rollDice(1)
        if (debug) console.log("parry procced", parry_roll)
        const parry_successful = parry_roll > max_hit_roll
        if (main_to_hit_roll.includes(max_hit_roll) && parry_successful) {
          main_hits -= main_hits > 0 ? 1 : 0
          if (debug) console.log("main parry successful", main_hits)
        } else if (parry_successful){
          offhand_hits -= offhand_hits > 0 ? 1 : 0
          if (debug) console.log("offhand parry successful", offhand_hits)
        }
      }

    }

    // To Wound
    let main_wound_roll = []
    let offhand_wound_roll = []
    let main_wounds = 0
    let offhand_wounds = 0
    let main_armour_save_roll = []
    let offhand_armour_save_roll = []
    let main_injury_roll = []
    let offhand_injury_roll = []
    if (defender.status == "stunned") {
      main_wound_roll = ['coup de grace']
      main_injury_roll = ['coup de grace']
      defender.status = "out of action"
      if (debug) console.log("defender stunnes - taken OOA")
    } else {
      main_wound_roll = rollDice(main_hits)
      main_wounds = main_wound_roll.filter((roll) => roll >= toWound(attacker.strength, defender.toughness)).length
      if (debug) console.log("main wound roll, wounds", main_wound_roll, main_wounds)
      offhand_wound_roll = rollDice(offhand_hits)
      offhand_wounds = offhand_wound_roll.filter((roll) => roll >= toWound(attacker.strength, defender.toughness)).length
      if (debug) console.log("offhand wound roll, wounds", offhand_wound_roll, offhand_wounds)

      // Crits
      const main_crit = main_wound_roll.some((roll) => roll == 6) && ableToCrit(attacker.strength, defender.toughness)
      const offhand_crit = offhand_wound_roll.some((roll) => roll == 6) && ableToCrit(attacker.strength, defender.toughness)
      const crit_roll = rollDice(1)
      if (debug) console.log("main crit, offhand crit, crit roll", main_crit, offhand_crit, crit_roll)
      const [no_armour_save, extra_wounds, injury_bonus] = main_crit || offhand_crit ? getCrit(crit_roll) : [false, 0, 0]
      if (main_crit) {
        main_wounds += extra_wounds
        if (debug) console.log("main crit procced", main_wounds)
      } else if (offhand_crit) {
        offhand_wounds += extra_wounds
        if (debug) console.log("offhand crit procced", offhand_wounds)
      }

      // Armour saves
      main_armour_save_roll = rollDice(main_wounds)
      offhand_armour_save_roll = rollDice(offhand_wounds)
      if (debug) console.log("main armour save roll", main_armour_save_roll, "offhand armour save roll", offhand_armour_save_roll)
      if (no_armour_save) {
        main_armour_save_roll = ['crit no armour save']
        offhand_armour_save_roll = ['crit no armour save']
      } else {
        main_wounds = main_armour_save_roll.filter((roll) => roll < armour_save(attacker.strength, defender.armour_save)).length
        offhand_wounds = offhand_armour_save_roll.filter((roll) => roll < armour_save(attacker.strength, defender.armour_save)).length
      }

      // Injuries
      if (debug) console.log("defender status", defender.status, "main wounds", main_wounds, "offhand wounds", offhand_wounds)
      if (defender.status == "knocked down" && main_wounds + offhand_wounds > 0) {
        defender.status = "out of action"
        if (debug) console.log("defender knocked down - taken OOA")
      } else if (main_wounds + offhand_wounds >= defender.wounds) {
        let main_injuries = main_wounds
        let offhand_injuries = offhand_wounds

        if (defender.wounds >= 3) {
          defender.wounds -= offhand_injuries
          offhand_injuries = 0
          main_injuries = main_injuries - defender.wounds + 1
        } else if (defender.wounds == 2) {
          switch (offhand_injuries) {
            case 2:
              offhand_injuries = 1
              break
            case 1:
              offhand_injuries = 0
              main_injuries = main_injuries - 1
              break
            case 0:
              main_injuries = main_injuries - 2
              break
          }
        }

        main_injury_roll = rollDice(main_injuries)
        offhand_injury_roll = rollDice(offhand_injuries)
        if (debug) console.log("main injury roll", main_injury_roll, "offhand injury roll", offhand_injury_roll)

        const highest_injury_roll = Math.max(...[...main_injury_roll, ...offhand_injury_roll]) + injury_bonus
        const highest_injury = injury(highest_injury_roll)
        defender.status = highest_injury
        if (debug) console.log("highest injury roll", highest_injury_roll, "injury", highest_injury)
      }

      defender.wounds -= main_wounds + offhand_wounds
      if (defender.wounds < 1) defender.wounds = 1
    }
    return {'to_hit_rolls': [main_to_hit_roll, offhand_to_hit_roll], 'hits': [main_hits, offhand_hits], 'to_wound_rolls': [main_wound_roll, offhand_wound_roll], 'wounds': [main_wounds, offhand_wounds], 'armour_save_rolls': [main_armour_save_roll, offhand_armour_save_roll], 'injury_rolls': [main_injury_roll, offhand_injury_roll], 'parry_roll': parry_roll}
}

  const runSimulateCombat = function () {
    const weapons = {
      'sword': {
          strength_mod: 0,
          type: "slashing",
          tags: ['parry']
      },
      'club': {
          strength_mod: 0,
          type: "bashing",
          tags: ['concussion']
      }
    }

    const armour = {
      'buckler': {
        tags: ['parry', 'reroll parry']
      }
    }

    const warrior_1 = {
      name: "warrior_1",
      ws: 3,
      strength: 3,
      toughness: 3,
      attacks: 1,
      wounds: 1,
      initiative: 3,
      status: "standing",
      weapons: [weapons['sword']],
      armour: [armour['buckler']],
      armour_save: 7,
      charger: false,
      stood_up: false
    }

    const warrior_2 = {
      name: "warrior_2",
      ws: 3,
      strength: 3,
      toughness: 3,
      attacks: 1,
      wounds: 1,
      initiative: 3,
      status: "standing",
      weapons: [weapons['club'], weapons['club']],
      armour: [],
      armour_save: 7,
      charger: false,
      stood_up: false
    }
    const no_charger = !warrior_1.charger && !warrior_2.charger
    const wins = {
      "warrior_1": 0,
      "warrior_2": 0
    }
    const number_of_simulations = 1
    const final_rounds = {}
    for (let i = 0; i < number_of_simulations; i++) {
      if (no_charger) {
        if (i % 2 == 0) {
          warrior_1.charger = true
          warrior_2.charger = false
        } else  {
          warrior_1.charger = false
          warrior_2.charger = true
        }
      }
      const [winner, round] = warrior_1.charger ? simulateCombat(warrior_1, warrior_2) : simulateCombat(warrior_2, warrior_1)

      wins[winner.name] += 1
      final_rounds[round] = final_rounds[round] ? final_rounds[round] + 1 : 1
    }
    console.log(wins)
    console.log("warrior_1 win rate: " + wins["warrior_1"] / number_of_simulations * 100 + "%")
    console.log("warrior_2 win rate: " + wins["warrior_2"] / number_of_simulations * 100 + "%")
    console.log(final_rounds)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => runSimulateCombat()}>
          simulate combat
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
