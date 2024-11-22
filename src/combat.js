import { weapons, armour } from './equipment.js';
const debug = false

export const runSimulateCombat = function (warrior1, warrior2, house_rules={
  minus1ToHitOffhand: false,
  minus2ToHitOffhand: false,
  minusToHitOffhand: 0,
  minusToHitDW: false,
  addWSToParry: false,
  ogSpears: false
}) {
  house_rules.minusToHitOffhand = 0
  if (house_rules.minus1ToHitOffhand) house_rules.minusToHitOffhand = 1
  if (house_rules.minus2ToHitOffhand) house_rules.minusToHitOffhand = 2

  const warrior_1 = createWarriorFromForm("warrior_1", warrior1)
  const warrior_2 = createWarriorFromForm("warrior_2", warrior2)

  const no_charger = (!warrior_1.charger && !warrior_2.charger) || (warrior_1.charger && warrior_2.charger)
  const wins = {
    "warrior_1": 0,
    "warrior_2": 0
  }
  const number_of_simulations = 100000
  const final_rounds = {'warrior_1': {}, 'warrior_2': {}}
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
    const [winner, round] = warrior_1.charger ? simulateCombat(warrior_1, warrior_2, house_rules) : simulateCombat(warrior_2, warrior_1, house_rules)
    const winner_round = final_rounds[winner.name]
    wins[winner.name] += 1
    winner_round[round] = winner_round[round] ? winner_round[round] + 1 : 1
  }

  const win_rate_warrior_1 = wins["warrior_1"] / number_of_simulations * 100
  const win_rate_warrior_2 = wins["warrior_2"] / number_of_simulations * 100

  console.log(wins)
  console.log("warrior_1 win rate: " + win_rate_warrior_1 + "%")
  console.log("warrior_2 win rate: " + win_rate_warrior_2 + "%")
  console.log(final_rounds)

  return {win_rate_warrior_1, win_rate_warrior_2}
}

const simulateCombat = function (warrior_1_base, warrior_2_base, house_rules) {


  // Parse and stringify to create a deep copy of the objects
  const warrior_1 = JSON.parse(JSON.stringify(warrior_1_base))
  const warrior_2 = JSON.parse(JSON.stringify(warrior_2_base))

  let attacker = warrior_1
  let defender = warrior_2
  let round_number = 0
  let fight_done = false
  let first_round = true
  const fight_log = []

  while (!fight_done) {
    round_number += 1
    // Recovery phase
    if (round_number % 2 == 0) {
      // The charge-receiver recovers on round 2, 4, 6 etc
      doRecovery(warrior_2)
    } else  {
      // The charger recovers on round 1, 3, 5 etc
      doRecovery(warrior_1)
    }
    [attacker, defender] = whoStrikesFirst(warrior_1, warrior_2, first_round, house_rules)

    const attackers_round = attacker.status == "standing" ? fightCombatRound(attacker, defender, first_round, house_rules) : {}
    const defenders_round = defender.status == "standing" ? fightCombatRound(defender, attacker, first_round, house_rules) : {}
    if (debug) console.log("End of round statuses", warrior_1.status, warrior_2.status, "fight done?", warrior_1.status == "out of action" || warrior_2.status == "out of action")

    // If any warrior is OOA the combat is over.
    if (warrior_1.status == "out of action" || warrior_2.status == "out of action") {
      fight_done = true
      // console.log("Fight over in round " + round_number)
    }
    first_round = false

    fight_log.push({'round': round_number, 'attacker_round': attackers_round, 'defender_round': defenders_round, w1s: warrior_1.status, w2s: warrior_2.status, attacker: attacker.name, defender: defender.name})
  }
  if (debug) console.log(fight_log)
  const winner = warrior_1.status == "out of action" ? warrior_2 : warrior_1
  return [winner, round_number]
}

const fightCombatRound = function (attacker, defender, first_round, house_rules) {
  const {
    main_hits,
    offhand_hits,
    main_to_hit_roll,
    offhand_to_hit_roll,
    parry_roll
  } = toHitPhase(attacker, defender, house_rules)

  let {
    main_wound_roll,
    offhand_wound_roll,
    main_wounds,
    offhand_wounds,
    main_armour_save_roll,
    offhand_armour_save_roll,
    injury_bonus
  } = toWoundPhase(attacker, defender, main_hits, offhand_hits, first_round)

  const {
    main_injury_roll,
    offhand_injury_roll
  } = injuryPhase(attacker, defender, main_wounds, offhand_wounds, injury_bonus)

  return {'to_hit_rolls': [main_to_hit_roll, offhand_to_hit_roll], 'hits': [main_hits, offhand_hits], 'to_wound_rolls': [main_wound_roll, offhand_wound_roll], 'wounds': [main_wounds, offhand_wounds], 'armour_save_rolls': [main_armour_save_roll, offhand_armour_save_roll], 'injury_rolls': [main_injury_roll, offhand_injury_roll], 'parry_roll': parry_roll}
}

const createWarriorFromForm = function (name, formData) {

  const equipped_weapons = [weapons[formData.mainHand]]
  if (formData.offHand != 'emptyHand') equipped_weapons.push(weapons[formData.offHand])

  const equipped_armour = formData.selectedArmour.map((type) => armour[type])
  const armour_save = equipped_armour.reduce((acc, armour) => acc - armour.save, 7)

  const warrior = {
    name: name,
    ws: parseInt(formData.WS),
    strength: parseInt(formData.S),
    toughness: parseInt(formData.T),
    attacks: parseInt(formData.A),
    wounds: parseInt(formData.W),
    initiative: parseInt(formData.I),
    status: "standing",
    weapons: equipped_weapons,
    armour: equipped_armour,
    armour_save: armour_save,
    charger: formData.charger,
    stood_up: false
  }

  return warrior
}

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

export const toHitPhase = function (attacker, defender, house_rules={
  minus1ToHitOffhand: false,
  minus2ToHitOffhand: false,
  minusToHitOffhand: 0,
  minusToHitDW: false,
  addWSToParry: false,
  ogSpears: false
}) {
  const {minusToHitOffhand, minusToHitDW, addWSToParry} = house_rules
  let main_weapon = attacker.weapons[0]
  let offhand_weapon = attacker.weapons[1]

  if (debug) console.log("weapons", main_weapon, offhand_weapon)

  // Initiate variables, these will be updated in the to hit, to wound and armour save phases
  let main_hits = 0
  let offhand_hits = 0
  let main_to_hit_roll = []
  let offhand_to_hit_roll = []
  let parry_roll = []

  // Auto hit if the defender is knocked down or stunned
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
    // Roll to hit dice
    main_to_hit_roll = rollDice(attacker.attacks)

    // Roll for offhand weapon if available, this is done separately to make it easier to apply house rules
    offhand_to_hit_roll = offhand_weapon ? rollDice(1) : []

    // Apply offhand house rules, if active
    if (minusToHitOffhand > 0) {
      offhand_to_hit_roll = offhand_to_hit_roll.map((roll) => roll - minusToHitOffhand)
    }

    if (minusToHitDW && offhand_weapon) {
      main_to_hit_roll = main_to_hit_roll.map((roll) => roll - 1)
      offhand_to_hit_roll = offhand_to_hit_roll.map((roll) => roll - 1)
    }

    // Filter out any dice below the target to hit value
    main_hits = main_to_hit_roll.filter((roll) => roll >= toHit(attacker.ws, defender.ws)).length
    if (debug) console.log("main to hit, hits", main_to_hit_roll, main_hits)

    // Filter out any dice below the target to hit value
    offhand_hits = offhand_to_hit_roll.filter((roll) => roll >= toHit(attacker.ws, defender.ws)).length
    if (debug) console.log("offhand to hit, hits", offhand_to_hit_roll, offhand_hits)

    // Check if opponent has parry equipment
    const parry_weapons = defender.weapons.filter((weapon) => weapon.tags.includes('parry'))
    const parry_armour = defender.armour.filter((armour) => armour.tags.includes('parry'))
    if (debug) console.log("parry equipment", parry_weapons, parry_armour)

    // Combine all parry equipment and combine all to hit rolls to determine if parry is possible, and if re-roll parry is available
    const combined_parry_equipment = [...parry_weapons, ...parry_armour]
    const combined_hit_roll = [...main_to_hit_roll, ...offhand_to_hit_roll]
    const max_hit_roll = Math.max(...combined_hit_roll)
    if (debug) console.log("max hit roll", max_hit_roll)

    // If the defender has at least one weapon or armour with the parry tag, allow parry
    if (debug) console.log("parry conditions", combined_parry_equipment.length > 0, max_hit_roll != 6, !combined_hit_roll.includes('auto hit'))
    if (combined_parry_equipment.length > 0 && max_hit_roll != 6 && !combined_hit_roll.includes('auto hit')) {
      // If the defender has more than two weapons or armours with the parry tag, check for reroll parry tag and roll 2 dice
      parry_roll = combined_parry_equipment.length > 1 && combined_parry_equipment.some((eq) => eq.tags.includes('reroll parry')) ? rollDice(2) : rollDice(1)
      if (debug) console.log("parry procced", parry_roll)
      // Get the highest of the parry rolls, in case of a re-roll.
      parry_roll = Math.max(...parry_roll)

      // If parry roll is higher than the highest hit roll, parry is successful
      let parry_successful = parry_roll > max_hit_roll

      // If house rule is active, add WS to parry roll
      if (addWSToParry) {
        if (debug) console.log("parry roll + ws, max hit roll + ws", parry_roll, defender.ws, max_hit_roll, attacker.ws)
        parry_successful = parry_roll + defender.ws > max_hit_roll + attacker.ws
      }

      // If the parry was successful, determine if it was a mainhand or offhand hit that should be negated.
      if (main_to_hit_roll.includes(max_hit_roll) && parry_successful) {
        main_hits -= main_hits > 0 ? 1 : 0
        if (debug) console.log("main parry successful", main_hits)
      } else if (parry_successful){
        offhand_hits -= offhand_hits > 0 ? 1 : 0
        if (debug) console.log("offhand parry successful", offhand_hits)
      }
    }
  }
  return { main_hits, offhand_hits, main_to_hit_roll, offhand_to_hit_roll, parry_roll }
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

export const toWoundPhase = function (attacker, defender, main_hits, offhand_hits, first_round, no_crits = false) {
    // To Wound
  // Initiate variables, these will be updated in the to wound and armour save phases
  let main_wound_roll = []
  let offhand_wound_roll = []
  let main_wounds = 0
  let offhand_wounds = 0
  let main_armour_save_roll = []
  let offhand_armour_save_roll = []
  let main_weapon = attacker.weapons[0]
  let offhand_weapon = attacker.weapons[1]

  // Determine strength for each weapon
  let main_strength = attacker.strength + main_weapon.strength_mod

  // Check for first round bonuses for weapons, like morning stars, flails, etc.
  // If not first round, strength is base strength
  if (main_weapon.tags.includes('first round bonus') && !first_round) {
    main_strength = attacker.strength
  }

  // Same thing as above, but for offhand weapon
  let offhand_strength = attacker.strength
  if (offhand_weapon && offhand_weapon.strength_mod) offhand_strength += offhand_weapon.strength_mod
  if (offhand_weapon && offhand_weapon.tags.includes('first round bonus') && !first_round) {
    offhand_strength = attacker.strength
  }

  // Roll to wound dice for main hand attacks, filter out those below the target value
  main_wound_roll = rollDice(main_hits)
  main_wounds = main_wound_roll.filter((roll) => roll >= toWound(main_strength, defender.toughness)).length
  if (debug) console.log("main wound roll, wounds", main_wound_roll, main_wounds)

  // Same as above, but for offhand attacks
  offhand_wound_roll = rollDice(offhand_hits)
  offhand_wounds = offhand_wound_roll.filter((roll) => roll >= toWound(offhand_strength, defender.toughness)).length
  if (debug) console.log("offhand wound roll, wounds", offhand_wound_roll, offhand_wounds)

  // Crits
  // Check for sixes to determine  if there was any crits.
  let main_crit = main_wound_roll.some((roll) => roll == 6) && ableToCrit(main_strength, defender.toughness)
  let offhand_crit = offhand_wound_roll.some((roll) => roll == 6) && ableToCrit(offhand_strength, defender.toughness)
  const crit_roll = rollDice(1)
  if (debug) console.log("main crit, offhand crit, crit roll", main_crit, offhand_crit, crit_roll)

  // If no crits flag are set, set crits to false. No crits should only be used for testing.
  if (no_crits) {
    main_crit = false
    offhand_crit = false
  }

  // Retrieve crit bonuses if crit procced
  const [no_armour_save, extra_wounds, injury_bonus] = main_crit || offhand_crit ? getCrit(crit_roll) : [false, 0, 0]
  if (main_crit) {
    main_wounds += extra_wounds
    if (debug) console.log("main crit procced", main_wounds)
  } else if (offhand_crit) {
    offhand_wounds += extra_wounds
    if (debug) console.log("offhand crit procced", offhand_wounds)
  }

  // Armour saves
  // Roll armour saves separately for main hand and offhand attacks
  main_armour_save_roll = rollDice(main_wounds)
  offhand_armour_save_roll = rollDice(offhand_wounds)
  if (debug) console.log("main armour save roll", main_armour_save_roll, "offhand armour save roll", offhand_armour_save_roll)

  if (no_armour_save) {
    // No armour save from certain crits
    main_armour_save_roll = ['crit no armour save']
    offhand_armour_save_roll = ['crit no armour save']
  } else {

    // Apply AP from weapons
    const main_ap = main_weapon.ap ? main_weapon.ap : 0
    const offhand_ap = offhand_weapon && offhand_weapon.ap ? offhand_weapon.ap : 0

    // Filter out unsaved wounds if roll is below the target armour save
    main_wounds = main_armour_save_roll.filter((roll) => roll < modifyArmourSave(main_strength, defender.armour_save - main_ap)).length
    offhand_wounds = offhand_armour_save_roll.filter((roll) => roll < modifyArmourSave(offhand_strength, defender.armour_save - offhand_ap)).length
  }

  return { main_wound_roll, offhand_wound_roll, main_wounds, offhand_wounds, main_armour_save_roll, offhand_armour_save_roll, injury_bonus, no_armour_save, extra_wounds }
}

export const injuryPhase = function (attacker, defender, main_wounds, offhand_wounds, injury_bonus) {
  // Initiate variables, these will be updated in the to wound and armour save phases
  let main_injury_roll = []
  let offhand_injury_roll = []
  let main_weapon = attacker.weapons[0]
  let offhand_weapon = attacker.weapons[1]

  // If the defender is stunned, auto OOA it.
  if (defender.status == "stunned") {
    main_injury_roll = ['coup de grace']
    defender.status = "out of action"
    if (debug) console.log("defender stunnes - taken OOA")
  } else {
    // Injuries
    if (debug) console.log("defender status", defender.status, "main wounds", main_wounds, "offhand wounds", offhand_wounds)

    // Any unsaved wounds Auto-OOA the defender if it is knocked down
    if (defender.status == "knocked down" && main_wounds + offhand_wounds > 0) {
      defender.status = "out of action"
      if (debug) console.log("defender knocked down - taken OOA")
    } else if (main_wounds + offhand_wounds >= defender.wounds) {
      // If the number of wounds inflicted is higher than the defenders wounds left, injuries are inflicted.
      let main_injuries = main_wounds
      let offhand_injuries = offhand_wounds

      if (defender.wounds >= 3) {
        // First remove offhand injuries, then main injuries
        defender.wounds -= offhand_injuries
        offhand_injuries = 0
        // We now remove the remaining wounds to determine the number of injuries, and add +1 for bringing the defender to 0 wounds (from 1 -> 0)
        main_injuries = main_injuries - defender.wounds + 1
      } else if (defender.wounds == 2) {
        switch (offhand_injuries) {
          case 2:
            // If offhand critted and caused 2 wounds, and the defender has 2 wounds, then 1 injury is caused by the offhand.
            offhand_injuries = 1
            break
          case 1:
            // If the offhand landed 1 wound and the main hand 1+ wounds, then the offhand injury is removed and all the wounds are considered main hand injuries.
            offhand_injuries = 0
            break
          case 0:
            // No offhand injuries, all wounds are main hand injuries, remove 1 wound to get a correct number of injury rolls.
            main_injuries = main_injuries - 1
            break
        }
      }

      // Roll dice for main hand and offhand injuries
      main_injury_roll = rollDice(main_injuries)
      offhand_injury_roll = rollDice(offhand_injuries)
      if (debug) console.log("main injury roll", main_injury_roll, "offhand injury roll", offhand_injury_roll)

      // Apply concussion rule to injury rolls if the weapon has the concussion tag
      if (main_weapon.tags.includes('concussion')) {main_injury_roll = main_injury_roll.map((roll) => roll == 2 ? 3 : roll)}
      if (offhand_weapon && offhand_weapon.tags.includes('concussion')) {offhand_injury_roll = offhand_injury_roll.map((roll) => roll == 2 ? 3 : roll)}

      // Determine the highest injury roll and apply the injury
      const highest_injury_roll = Math.max(...[...main_injury_roll, ...offhand_injury_roll]) + injury_bonus
      const highest_injury = injury(highest_injury_roll)
      defender.status = highest_injury
      if (debug) console.log("highest injury roll", highest_injury_roll, "injury", highest_injury)

      if (defender.armour.some((armour) => armour.tags.includes('avoid stun')) && rollDice(1)[0] >= 4) {
         defender.status = "knocked down"
      }
    }

    // Remove wounds from defender
    defender.wounds -= (main_wounds + offhand_wounds)
    // If the defender has less than 1 wounds, set it to 1 to avoid negative wounds.
    // This also makes the logic easier since 0 wounds and 1 wound is almost the same.
    if (defender.wounds < 1) defender.wounds = 1
  }
  return { main_injury_roll, offhand_injury_roll }
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

const modifyArmourSave = function (attacker_strength, armour_save) {
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

export const doRecovery = function (warrior) {
  // Recovery phase, stunned goes to knocked down, knocked down goes to standing
  if (warrior.status == "knocked down") {
      warrior.status = "standing"
      warrior.stood_up = true
  }
  if (warrior.status == "stunned") {
      warrior.status = "knocked down"
  }
}

export const whoStrikesFirst = function (warrior_1, warrior_2, first_turn, house_rules) {
  const {ogSpears} = house_rules
  const warrior_1_tags = warrior_1.weapons.map((weapon) => weapon.tags).flat()
  const warrior_2_tags = warrior_2.weapons.map((weapon) => weapon.tags).flat()

  // If any warrior just stood up, the other warrior strikes first
  if (warrior_1.stood_up || warrior_2.stood_up) {
    if (warrior_2.stood_up) {
      warrior_2.stood_up = false
      return [warrior_1, warrior_2]
    } else {
      warrior_1.stood_up = false
      return [warrior_2, warrior_1]
    }
  }

  // If any warrior carries a weapon with the "strike last" tag, that warrior strikes last
  if (warrior_1_tags.includes('strike last') && !warrior_2_tags.includes('strike last')) {
    return [warrior_2, warrior_1]
  } else if (warrior_2_tags.includes('strike last') && !warrior_1_tags.includes('strike last')) {
    return [warrior_1, warrior_2]
  }

  if (first_turn) {
    // If ogSpears house rule is active, the warrior with the spear strikes first no matter the initiative/charger
    if (ogSpears) {
      if (warrior_1.weapons.some((weapon) => weapon.name == 'spear')) {
        return [warrior_1, warrior_2]
      } else if (warrior_2.weapons.some((weapon) => weapon.name == 'spear')) {
        return [warrior_2, warrior_1]
      }
    } else {
      // If it's the first turn the charger strikes first, unless the other warrior has the "strike first" tag, then it defaults to initiative
      if (warrior_1.charger && !warrior_2_tags.includes('strike first')) {
        return [warrior_1, warrior_2]
      } else  if (warrior_2.charger && !warrior_1_tags.includes('strike first')) {
        return [warrior_2, warrior_1]
      }
    }
  }

  // Default to initiative
  if (warrior_1.initiative > warrior_2.initiative) {
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