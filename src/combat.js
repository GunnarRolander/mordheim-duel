import { ranged_weapons, weapons, armour } from './equipment.js'
const debug = false

export const runSimulateCombat = function (warrior1, warrior2, house_rules={
  minus1ToHitOffhand: false,
  minus2ToHitOffhand: false,
  minusToHitOffhand: 0,
  minusToHitDW: false,
  addWSToParry: false,
  ogSpears: false
}, nrOfSimulations=100000) {
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
  const number_of_simulations = nrOfSimulations
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

  return {win_rate_warrior_1, win_rate_warrior_2, final_rounds}
}

const createWeaponBase = function (attacker, defender, ws) {
  return {
    ws: ws, 
    bs: attacker.bs, 
    strength: attacker.strength, 
    initiative: attacker.initiative,
    source: attacker.name, 
    target: defender.name, 
    offHand: false,
    injury_bonus: 0,
    injury_roll: 0,
    injury: '',
    crit: false,
    hit: false,
    wounded: false,
    unsaved_wounds: 0,
    wounds_caused: 0,
    result: '',
    to_hit_roll: 0,
    to_wound_roll: 0,
    armour_save_roll: 0,
    no_armour_save: false,
    parry_roll: 0,
    parryable: true,
    ap: 0,
    reroll_misses: false
  }
}
// To handle different initiative attacks, set up the attack slots for each warrior
// then sort the attacks in initiative order, instead of sorting the warriors.
// Make sure to save status of the target at the start of round, so no auto-OOA's occur due to timing differences.
export const setUpAttacks = function (attacker, defender, round_number) {
 
  let nbr_attacks = attacker.attacks
  let ws = attacker.ws

  if (attacker.skills.includes('pit fighter')) {
    // If the attacker has the pit fighter skill, they get +1 attack and +1 WS
    nbr_attacks += 1
    ws += 1
  }

  if (attacker.frenzy) {
    nbr_attacks = nbr_attacks * 2 // Frenzy doubles the number of attacks
  }

  attacker.attack_slots = []
  const mainhand_pistol = attacker.weapons_mainhand.filter((weapon) => weapon.tags.includes('pistol'))[0]
  const offhand_pistol = attacker.weapons_offhand.filter((weapon) => weapon.tags.includes('pistol'))[0]
  const weapons_equipped_this_round = []

  if (round_number == 1 && mainhand_pistol && mainhand_pistol.tags.includes('shoot_hth')) {
    attacker.attack_slots.push({
      ...createWeaponBase(attacker, defender, ws), 
      weapon: mainhand_pistol,
      ap: mainhand_pistol.ap || 0,
      strength: mainhand_pistol.strength, 
      initiative: 199 + attacker.initiative * 0.1, // Shoot in HtH always strikes firstest
      bs: attacker.bs - 2, // Use BS for shoot in HtH,
      parryable: false // Shoot in HtH cannot be parried
    })
    weapons_equipped_this_round.push(mainhand_pistol)
  }

  if (round_number == 1 && mainhand_pistol && !mainhand_pistol.tags.includes('shoot_hth')) {
    attacker.attack_slots.push({
      ...createWeaponBase(attacker, defender, ws), 
      weapon: mainhand_pistol,
      ap: mainhand_pistol.ap || 0,
      strength: mainhand_pistol.strength, 
    })
    weapons_equipped_this_round.push(mainhand_pistol)
  } else {
    for (let i = 0; i < nbr_attacks; i++) {
      attacker.attack_slots.push({
        ...createWeaponBase(attacker, defender, ws), 
        weapon: attacker.weapons_mainhand[0]
      })
    }
    weapons_equipped_this_round.push(attacker.weapons_mainhand[0])
  }

  if (round_number == 1 && offhand_pistol && offhand_pistol.tags.includes('shoot_hth')) {
    attacker.attack_slots.push({
      ...createWeaponBase(attacker, defender, ws), 
      weapon: offhand_pistol,
      ap: offhand_pistol.ap || 0,
      strength: offhand_pistol.strength, 
      initiative: 199 + attacker.initiative * 0.1, // Shoot in HtH always strikes firstest
      bs: attacker.bs - 2, // Use BS for shoot in HtH,
      parryable: false // Shoot in HtH cannot be parried
    })
    weapons_equipped_this_round.push(offhand_pistol)
  }

  if (round_number == 1 && offhand_pistol && !offhand_pistol.tags.includes('shoot_hth')) {
    attacker.attack_slots.push({
      ...createWeaponBase(attacker, defender, ws), 
      weapon: offhand_pistol,
      strength: offhand_pistol.strength, 
      ap: offhand_pistol.ap || 0,
      offHand: true
    })
    weapons_equipped_this_round.push(offhand_pistol)
  } else if (attacker.weapons_offhand[0] && !attacker.weapons_offhand[0].tags.includes('pistol')) {
    attacker.attack_slots.push({
      ...createWeaponBase(attacker, defender, ws), 
      weapon: attacker.weapons_offhand[0],
      offHand: true 
    })
    weapons_equipped_this_round.push(attacker.weapons_offhand[0])
  }

  if (round_number == 1) {
    for (const weapon of weapons_equipped_this_round) {
      if (weapon.tags.includes('whipcrack')) {
        attacker.attack_slots.push({
          ...createWeaponBase(attacker, defender, ws), 
          weapon: weapon, 
          parryable: false,
          initiative: 99 + attacker.initiative * 0.1, // Whipcrack always strikes first
        })
        break
      }
    }

    for (const attack of attacker.attack_slots) {
      if ((attacker.skills.includes('expert swordsman') && attacker.charger && attack.weapon.tags.includes('sword')) || attacker.tags.includes('hatred')) {
        // If the attacker has the expert swordsman skill, they get +1 WS and +1 initiative for sword attacks
        attack.reroll_misses = true
      }
      if (attacker.skills.includes('unstoppable charge') && attacker.charger) {
        attack.ws += 1
      }
    }
  }
  attacker.weapons = weapons_equipped_this_round
  return attacker
}

const setInitiativeOfAttacks = function (attack, warrior, round_number) {
  let initiative = attack.initiative
  initiative += attack.weapon.init_mod ? attack.weapon.init_mod : 0

  
  // If the weapon of an attack has a tag that indicates it should strike first, set the initiative to 99
  if ((attack.weapon.tags.includes('strike first') || warrior.charger || warrior.skills.includes('lightning reflexes')) && round_number == 1) {
    initiative = 99 + warrior.initiative * 0.1
  }

  // If the weapon of an attack has a tag that indicates it should strike first, set the initiative to 99
  if (attack.weapon.tags.includes('shoot_hth') && round_number == 1) {
    initiative = 199 + warrior.initiative * 0.1
  }

  // If the weapon of an attack has a tag that indicates it should strike last, set the initiative to -1
  if (attack.weapon.tags.includes('strike last') && !warrior.skills.includes('strongman')) {
    initiative = -1
  }

  if (warrior.stood_up) {
    initiative = -2
  }

  attack.initiative = initiative

  return initiative
}

export const orderAttacksByInitiative = function (attacker, defender, round_number) {
  const tie_rolls = {}

  //consolidate the attack slots into a single array
  const all_attack_slots = attacker.attack_slots.concat(defender.attack_slots)
  // Sort the attack slots by initiative, highest first, if initiative is the same, sort by offhand with true as last
  all_attack_slots.sort((a, b) => {
    const warrior_a = a.source === attacker.name ? attacker : defender
    const warrior_b = b.source === attacker.name ? attacker : defender

    // Add initiative modifiers from the weapon, if available
    const initiative_a = setInitiativeOfAttacks(a, warrior_a, round_number)
    const initiative_b = setInitiativeOfAttacks(b, warrior_b, round_number)

    if (initiative_a === initiative_b) {
      // If the initiative is the same, check if the source is the same
      if (a.source === b.source) {
        // If both attacks are from the same source, sort by offhand
        return a.offHand - b.offHand // false (0) comes before true (1)
      }
      let tie_roll = tie_rolls[initiative_a]
      tie_roll = tie_roll ? tie_roll : rollDice(1)[0] >= 4 ? a.source : b.source
      tie_rolls[initiative_a] = tie_roll

      if (tie_roll === a.source) {
        return -1 // a comes first
      } else if (tie_roll === b.source) {
        return 1 // b comes first
      }
    }
    return initiative_b - initiative_a // highest initiative first
  })

  //group attack slots by source and initiative
  const grouped_attacks = []
  let current_slot_tag = "initiative-source"
  const current_slot = []
  for (const attack of all_attack_slots) {
    const tag = attack.initiative + "-" + attack.source
    if (current_slot_tag !== tag) {
      if (current_slot.length > 0) {
        grouped_attacks.push(JSON.parse(JSON.stringify(current_slot)))
      }
      current_slot_tag = tag
      current_slot.length = 0 // Clear the current slot
    }
    current_slot.push(attack)
  }
  grouped_attacks.push(current_slot)

  return grouped_attacks
}

export const handleFear = function (warrior_1, warrior_2) {
  const attacker = warrior_1.charger ? warrior_1 : warrior_2
  const defender = warrior_1.charger ? warrior_2 : warrior_1
  if (defender.tags.includes('fear') && !(attacker.tags.includes('immune to fear') || attacker.tags.includes('fear') || attacker.tags.includes('frenzy'))) {
    const fear_roll = rollDice(2).reduce((a, b) => a + b)
    if (fear_roll > attacker.leadership) {
      defender.charger = true
      attacker.charger = false
      handleFear(warrior_2, warrior_1) // If the defender causes fear, the attacker can fail the charge
    }
  }
  if (attacker.tags.includes('fear') && !(defender.tags.includes('immune to fear') || defender.tags.includes('fear') || defender.tags.includes('frenzy'))) {
    const fear_roll = rollDice(2).reduce((a, b) => a + b)
    if (fear_roll > defender.leadership) {
      defender.feared = true
    }
  }
}

const simulateCombat = function (warrior_1_base, warrior_2_base, house_rules) {
  // Parse and stringify to create a deep copy of the objects
  let warrior_1 = JSON.parse(JSON.stringify(warrior_1_base))
  let warrior_2 = JSON.parse(JSON.stringify(warrior_2_base))
  
  let round_number = 0
  let fight_done = false
  let first_round = true
  const fight_log = []

  handleFear(warrior_1, warrior_2)
  
  while (!fight_done) {
    round_number += 1
    // Recovery phase
    // The charger recovers on round 1, 3, 5 etc and the charge-receiver recovers on round 2, 4, 6 etc
    doRecovery(warrior_1, round_number % 2 == 1)
    doRecovery(warrior_2, round_number % 2 == 0)

    warrior_1 = setUpAttacks(warrior_1, warrior_2, round_number)
    warrior_2 = setUpAttacks(warrior_2, warrior_1, round_number)
    
    const grouped_attacks = orderAttacksByInitiative(warrior_1, warrior_2, round_number)
    
    for (const attack_group of grouped_attacks) {
      const attacker = attack_group[0].source === warrior_1.name ? warrior_1 : warrior_2
      const defender = attack_group[0].target === warrior_2.name ? warrior_2 : warrior_1
      
      fightCombatRound(attacker, defender, attack_group, first_round, house_rules)
    }
    
    if (debug) console.log("End of round statuses", warrior_1.status, warrior_2.status, "fight done?", warrior_1.status == "out of action" || warrior_2.status == "out of action")

    // If any warrior is OOA the combat is over.
    if (warrior_1.status == "out of action" || warrior_2.status == "out of action") {
      fight_done = true
      // console.log("Fight over in round " + round_number)
    }
    first_round = false

    fight_log.push({'round': round_number, w1s: warrior_1.status, w2s: warrior_2.status, grouped_attacks: JSON.parse(JSON.stringify(grouped_attacks))})
    warrior_1.charger = false // Reset the charger status for the next round
    warrior_2.charger = false // Reset the charger status for the next round
    warrior_1.feared = false // Reset the feared status for the next round
    warrior_2.feared = false // Reset the feared status for the next round
  }
  if (debug) console.log(fight_log)
  const winner = warrior_1.status == "out of action" ? warrior_2 : warrior_1
  return [winner, round_number]
}

const fightCombatRound = function (attacker, defender, attack_group, first_round, house_rules) {
  if (attacker.status != "standing" || (attacker.stupid && !attacker.frenzy)) {
    for (const attack of attack_group) {
      attack.result = "Attacker is not standing, skipping attack"
      if (debug) console.log(attacker.name + " is not standing, skipping attack")
    }
    return attack_group
  }  

  toHitPhase(attacker, defender, attack_group, house_rules)

  toWoundPhase(attacker, defender, attack_group, first_round, false, house_rules)

  injuryPhase(attacker, defender, attack_group)

  return attack_group
}

const createWarriorFromForm = function (name, formData) {

  const equipped_weapons = [weapons[formData.mainHand]]
  if (formData.mainHandPistol != 'emptyHand') equipped_weapons.push(ranged_weapons[formData.mainHandPistol])
  const equipped_weapons_offhand = []
  if (formData.offHand != 'emptyHand') equipped_weapons_offhand.push(weapons[formData.offHand])
  if (formData.offHandPistol != 'emptyHand') equipped_weapons_offhand.push(ranged_weapons[formData.offHandPistol])

  const equipped_armour = formData.selectedArmour.map((type) => armour[type])

  const warrior = {
    name: name,
    ws: parseInt(formData.WS),
    bs: parseInt(formData.BS),
    strength: parseInt(formData.S),
    toughness: parseInt(formData.T),
    attacks: parseInt(formData.A),
    wounds: parseInt(formData.W),
    initiative: parseInt(formData.I),
    leadership: parseInt(formData.LD),
    status: "standing",
    weapons_mainhand: equipped_weapons,
    weapons_offhand: equipped_weapons_offhand,
    weapons: equipped_weapons.concat(equipped_weapons_offhand),
    armour: equipped_armour,
    armour_save: formData.armourSave,
    charger: formData.charger,
    stood_up: false,
    tags: formData.tags,
    skills: formData.skills,
    frenzy: formData.tags.includes('frenzy'),
    feared: false,
  }

  return warrior
}

function getRandomInt(min, max) {
  // Create byte array and fill with 1 random number
  var byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)

  var range = max - min + 1
  var max_range = 256
  if (byteArray[0] >= Math.floor(max_range / range) * range)
      return getRandomInt(min, max)
  return min + (byteArray[0] % range)
}

const rollDice = function (number_of_dice) {
  const dice_results = []
  for (let i = 0; i < number_of_dice; i++) {
      dice_results.push(getRandomInt(1, 6))
  }
  return dice_results
}

const toHit = function (attacker_ws, defender_ws) {
  if (attacker_ws.feared) {
    return 6
  }
  if (attacker_ws > defender_ws) {
      return 3
  }
  if (defender_ws > attacker_ws * 2) {
      return 5
  }
  return 4
}

const toHitRanged = function (attacker_bs) {
  return 7 - attacker_bs
}

const rollToHit = function (attack, attacker, defender, house_rules={
  minus1ToHitOffhand: false,
  minus2ToHitOffhand: false,
  minusToHitOffhand: 0,
  minusToHitDW: false,
  addWSToParry: false
}) {
  const {minusToHitOffhand, minusToHitDW} = house_rules
  const weapon = attack.weapon
  const offhand = attack.offHand
  if (defender.old_status == "knocked down" || defender.old_status == "stunned") {
    attack.to_hit_roll = ['auto hit']
    attack.hit = true
    if (debug) console.log("defender " + defender.old_status + ", auto hit", attack)
  } else {
    attack.to_hit_roll = rollDice(1)[0]
    if (attack.to_hit_roll == 6 && weapon.tags.includes('poisoned') && !defender.tags.includes('immune to poison')) {
      attack.poison_proc = true
    }
    attack.to_hit_roll += weapon.hit_mod ? weapon.hit_mod : 0 

    
    // Apply offhand house rules, if active
    if (offhand && minusToHitOffhand > 0) {
      attack.to_hit_roll = attack.to_hit_roll - minusToHitOffhand
    }
    // If double weapon house rule is active, subtract 1 from all to hit roll
    if (minusToHitDW && attacker.weapons.length > 1) {
      attack.to_hit_roll = attack.to_hit_roll - 1
    }
    
    if (attack.weapon.tags.includes('shoot_hth')) {
      // If the weapon is a shoot in HtH weapon, use BS to hit  
      attack.hit = attack.to_hit_roll >= toHitRanged(attack.bs)
    } else {
      // Check if the to hit roll is higher than the target to hit value
      attack.hit = attack.to_hit_roll >= toHit(attack.ws, defender.ws, attacker)
    }
    if (!attack.hit) {
      attack.result = "Missed"
    }
  }
}

export const toHitPhase = function (attacker, defender, attack_group, house_rules={
  minus1ToHitOffhand: false,
  minus2ToHitOffhand: false,
  minusToHitOffhand: 0,
  minusToHitDW: false,
  addWSToParry: false
}) {
  const {minusToHitOffhand, minusToHitDW, addWSToParry} = house_rules
  
  // Initiate variables, these will be updated in the to hit, to wound and armour save phases
  for (const attack of attack_group) {
    rollToHit(attack, attacker, defender, house_rules)
    if (!attack.hit && attack.reroll_misses) {
      rollToHit(attack, attacker, defender, house_rules)
    }
  }

  // Check if opponent has parry equipment
  const parry_weapons = defender.weapons.filter((weapon) => weapon.tags.includes('parry'))
  const parry_armour = defender.armour.filter((armour) => armour.tags.includes('parry'))
  //if (debug) console.log("parry equipment", parry_weapons, parry_armour)

  // Combine all parry equipment and combine all to hit rolls to determine if parry is possible, and if re-roll parry is available
  const combined_parry_equipment = [...parry_weapons, ...parry_armour]
  const highest_hit_roll_attack = attack_group.sort((a, b) => b.to_hit_roll - a.to_hit_roll)[0]
  const max_hit_roll = highest_hit_roll_attack.to_hit_roll

  if (combined_parry_equipment.length > 0 && max_hit_roll != 6 && max_hit_roll != 'auto hit' && highest_hit_roll_attack.hit && highest_hit_roll_attack.parryable && !defender.parry_used) {
    // If the defender has more than two weapons or armours with the parry tag, check for reroll parry tag and roll 2 dice
    let parry_roll = combined_parry_equipment.length > 1 && combined_parry_equipment.some((eq) => eq.tags.includes('reroll parry')) ? rollDice(2) : rollDice(1)
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
    highest_hit_roll_attack.parry_roll = parry_roll

    if (parry_successful) {
      highest_hit_roll_attack.hit = false
      highest_hit_roll_attack.result = "Parried"
    }
  }

  defender.parry_used = true

  return attack_group
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

export const toWoundPhase = function (attacker, defender, attack_group, first_round, no_crits = false, house_rules = {}) {
  for (const attack of attack_group.filter((attack) => attack.hit)) {
    if (defender.old_status == "stunned") {
      attack.to_wound_roll = 'coup de grace'
      attack.wounded = true
      attack.unsaved_wounds = 1
      attack.caused_wounds = 1
      attack.result = "Defender is stunned, auto OOA"
      if (debug) console.log("Defender is stunned, auto OOA", attack)
      continue
    }

    const weapon = attack.weapon

    // Determine strength
    let strength = attack.strength
    strength += weapon.strength_mod ? weapon.strength_mod : 0 

    
    // Check for first round bonuses for weapons, like morning stars, flails, etc.
    // If not first round, strength is base strength
    if (weapon?.tags.includes('first round bonus') && !first_round) {
      strength = attack.strength
    }
    
    // Handle Mighty Blow skill
    if (attacker.skills.includes('mighty blow') && attack.weapon.name.substring(attack.weapon.name.length-6) != 'pistol') {
      strength += 1
    }

    const ap_strength = strength

    // Handle Resilient skill
    if (defender.skills.includes('resilient')) {
      strength += -1
    }

    attack.to_wound_roll = rollDice(1)[0]
    attack.crit = attack.to_wound_roll == 6 && ableToCrit(strength, defender.toughness) && !attacker.crit_this_turn && !no_crits

    
    // Sigmarite hammers and blessed weapons
    if (weapon.tags.includes('holy') && (defender.tags.includes('undead') || defender.tags.includes('possessed'))) {
      attack.to_wound_roll = attack.to_wound_roll + 1
    }
    
    // Check if the to wound roll is higher than the target to wound value
    attack.wounded = attack.to_wound_roll >= toWound(strength, defender.toughness) || attack.poison_proc
    if (attack.wounded) {
      attack.wounds_caused = 1
    } else {
      attack.wounds_caused = 0
      attack.result = "Failed to wound"
    }

    if (attack.crit) {
      attacker.crit_this_turn = true
      let crit_roll = rollDice(1)[0]
      if (attacker.skills.includes('web of steel')) crit_roll += 1
      const [no_armour_save, extra_wounds, injury_bonus] = getCrit(crit_roll)
      attack.no_armour_save = no_armour_save
      attack.wounds_caused = attack.wounds_caused + extra_wounds
      attack.injury_bonus = injury_bonus
    }
    
    attack.unsaved_wounds = attack.wounds_caused
    if (defender.armour_save < 7 && !attack.no_armour_save) {
      // Roll armour save
      attack.armour_save_roll = rollDice(1)[0]
      // Check if the armour save roll is higher than the target armour save value
      const save_successful = attack.armour_save_roll >= modifyArmourSave(ap_strength, weapon.ap, defender.armour_save, house_rules)
      if (save_successful) {
        attack.unsaved_wounds = 0
        attack.result = "Blocked by armour"
      }
    }

    if (defender.skills.includes('step aside') ) {
      // Roll Step Aside
      attack.step_aside_roll = rollDice(1)[0]
      // Check if the step aside roll is higher or equal to 5+
      const save_successful = attack.step_aside_roll >= 5
      if (save_successful) {
        attack.unsaved_wounds = 0
        attack.result = "Blocked by Step Aside"
      }
    }
  }

  return attack_group
}

export const injuryPhase = function (attacker, defender, attack_group) {
  for (const attack of attack_group.filter((attack) => attack.unsaved_wounds > 0)) {
    if (defender.status === "out of action") continue

    if (defender.old_status == "stunned") {
      attack.injury_roll = 'coup de grace'
      attack.injury = "out of action"
      attack.result = "Defender is stunned, coup de grace"
      defender.status = "out of action"
      if (debug) console.log("defender stunned - taken OOA")
    } else { 
      if (defender.old_status == "knocked down" && attack.unsaved_wounds > 0) {
        attack.injury_roll = 'knocked, squished'
        attack.injury = "out of action"
        attack.result = "Defender is knocked down, squished"
        defender.status = "out of action"
        if (debug) console.log("defender knocked down - taken OOA")
      } else {
        defender.wounds = defender.wounds - attack.unsaved_wounds

        if (defender.wounds < 1) {
          const injury_rolls = rollDice(1 - defender.wounds)

          for (let injury_roll of injury_rolls) {
            if (attacker.skills.includes('strike to injure')) injury_roll += 1
            injury_roll = attack.injury_bonus ? injury_roll + attack.injury_bonus : injury_roll
            const injury = getInjury(injury_roll, attack, defender)
            if (((defender.status == "knocked down" || defender.status == "standing") || injury == "out of action") && injury != "jumped up") {
              defender.status = injury
              attack.injury = injury
              attack.injury_roll = injury_roll
              defender.frenzy = false
            }
          }
          defender.wounds = 1 // 1 is the lowest, every wound below it becomes a injury roll
        }
      }
    }
  }

  return attack_group
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
    case 4:
      return [true, 1, 2]
  }
  return [false, 0, 0]
}

const modifyArmourSave = function (attacker_strength, weapon_ap = 0, armour_save, house_rules) {
  const {noStrengthBasedAP, ap5} = house_rules
  if (noStrengthBasedAP) return armour_save

  const AP_strength = ap5 ? 4 : 3
  const ap = attacker_strength > AP_strength ? attacker_strength - AP_strength : 0
  const armour_save_target = armour_save + ap - weapon_ap
  return armour_save_target
}

const getInjury = function (injury_roll, attack, defender) {
  injury_roll = attack.weapon?.tags.includes('concussion') && !defender.tags.includes('hard head') && injury_roll == 2 ? 3 : injury_roll

  if (injury_roll == 1 || injury_roll == 2) {
    if (defender.skills.includes('jump up')) {
      return "jumped up"
    }
    return "knocked down"
  }
  if (injury_roll == 3 || injury_roll == 4 || (defender.tags.includes('hard to kill') && injury_roll == 5)) {
    if ((defender.armour.some((armour) => armour.tags.includes('avoid stun')) && rollDice(1)[0] >= 4) || defender.tags.includes('no pain')) {
      return "knocked down"
    }
    return "stunned"
  }
  if (injury_roll >= 5) {
    return "out of action"
  }
  console.log("injury_roll: " + injury_roll + " is not valid")
  return "bugged"
}

export const doRecovery = function (warrior, your_turn) {
  warrior.stood_up = false
  warrior.stupid = false // Reset stupidity for the next turn
  // Recovery phase, stunned goes to knocked down, knocked down goes to standing
  if (warrior.status == "knocked down" && your_turn) {
      warrior.status = "standing"
      warrior.stood_up = true
    }
  if (warrior.status == "stunned" && your_turn) {
    warrior.status = "knocked down"
  }
  warrior.old_status = warrior.status
  warrior.crit_this_turn = false

  if (warrior.tags.includes('stupidity')) {
    warrior.stupid = rollDice(2).reduce((acc, val) => acc + val, 0) <= warrior.leadership
  }
}