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
  'helmet': {
    tags: ['avoid stun'],
    save: 0
  },
}