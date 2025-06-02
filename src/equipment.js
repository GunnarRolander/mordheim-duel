export const weapons = {
  'dagger': {
      name: 'dagger',
      strength_mod: 0,
      type: "slashing",
      tags: [],
      ap: 1
  },
  'handweapon': {
      name: 'hand weapon',
      strength_mod: 0,
      type: "slashing",
      tags: []
  },
  'ithilmar_handweapon': {
      name: 'ithilmar hand weapon',
      strength_mod: 0,
      init_mod: 1,
      type: "slashing",
      tags: []
  },
  'sword': {
      name: 'sword',
      strength_mod: 0,
      type: "slashing",
      tags: ['parry']
  },
  'axe': {
      name: 'axe',
      strength_mod: 0,
      type: "slashing",
      tags: [],
      ap: -1
  },
  'club': {
      name: 'club',
      strength_mod: 0,
      type: "bashing",
      tags: ['concussion']
  },
  'morning_star': {
      name: 'morning star',
      strength_mod: 1,
      type: "bashing",
      tags: ['first round bonus']
  },
  'flail': {
      name: 'flail',
      strength_mod: 2,
      type: "bashing",
      tags: ['first round bonus']
  },
  'halberd': {
      name: 'halberd',
      strength_mod: 1,
      type: "bashing",
      tags: []
  },
  'spear': {
      name: 'spear',
      strength_mod: 0,
      type: "bashing",
      tags: ['strike first']
  },
  'great weapon': {
      name: 'great weapon',
      strength_mod: 2,
      type: "bashing",
      tags: ['strike last']
  },
  'sigmarite hammer': {
      name: 'Sigmarite hammer',
      strength_mod: 1,
      type: "bashing",
      tags: ['concussion', 'holy']
  },
  'steel whip': {
      name: 'Steel whip',
      strength_mod: 0,
      type: "bashing",
      tags: ['whipcrack']
  },
  'fighting claws': {
      name: 'fighting claws',
      strength_mod: 0,
      type: "slashing",
      tags: ['parry', 'reroll parry']
  },
  'weeping blades': {
      name: 'weeping blades',
      strength_mod: 0,
      type: "slashing",
      tags: ['parry', 'poisoned']
  }
}

export const ranged_weapons = {
  'pistol': {
      name: 'pistol',
      strength: 4,
      type: "ranged",
      tags: ['pistol'],
      ap: -1
  },
  'duelling pistol': {
      name: 'duelling pistol',
      strength: 4,
      type: "ranged",
      tags: ['pistol'],
      ap: -1,
      hit_mod: 1
  },
  'warplock pistol': {
      name: 'warplock pistol',
      strength: 5,
      type: "ranged",
      tags: ['pistol'],
      ap: -1
  },
}

export const armour = {
  'buckler': {
    tags: ['parry', 'reroll parry'],
    save: 0
  },
  'shield': {
    tags: [],
    save: 1
  },
  'light armour': {
    tags: [],
    save: 1
  },
  'heavy armour': {
    tags: [],
    save: 2
  },
  'gromril armour': {
    tags: [],
    save: 3
  },
  'helmet': {
    tags: ['avoid stun'],
    save: 0
  },
}