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
      tags: ['parry', 'sword']
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
      tags: ['parry', 'poisoned', 'sword']
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
  'crossbow pistol': {
    name: 'crossbow pistol',
    strength: 4,
    type: "ranged",
    tags: ['pistol', 'shoot_hth'],
    parryable: false
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

export const skills = [
    {
        name: 'strike to injure',
        label: 'Strike to Injure',
        tags: [],
        category: 'combat',
    },
    {
        name: 'web of steel',
        label: 'Web of Steel',
        tags: [],
        category: 'combat',
    },
    {
        name: 'expert swordsman',
        label: 'Expert Swordsman',
        tags: [],
        category: 'combat',
        disabled: false
    },
    {
        name: 'step aside',
        label: 'Step Aside',
        tags: [],
        category: 'combat',
    },
    {
        name: 'mighty blow',
        label: 'Mighty Blow',
        tags: [],
        category: 'strength',
    },
    {
        name: 'pit fighter',
        label: 'Pit Fighter',
        tags: [],
        category: 'strength',
    },
    {
        name: 'resilient',
        label: 'Resilient',
        tags: [],
        category: 'strength',
    },
    {
        name: 'strongman',
        label: 'Strongman',
        tags: [],
        category: 'strength',
    },
    {
        name: 'unstoppable charge',
        label: 'Unstoppable Charge',
        tags: [],
        category: 'strength',
        disabled: false
    },
    {
        name: 'lightning reflexes',
        label: 'Lightning Reflexes',
        tags: [],
        category: 'speed'
    },
    {
        name: 'jump up',
        label: 'Jump Up',
        tags: [],
        category: 'speed'
    }
]

export const psychology = [
    {
        name: 'fear',
        label: 'Fear (?)',
        tags: [],
        category: 'psychology',
        tooltip: 'If the charger is feared, the fear-causer will become the charger instead.'
    },
    {
        name: 'frenzy',
        label: 'Frenzy',
        tags: [],
        category: 'psychology'
    },
    {
        name: 'hatred',
        label: 'Hatred',
        tags: [],
        category: 'psychology'
    },
    {
        name: 'stupidity',
        label: 'Stupidity',
        tags: [],
        category: 'psychology'
    }
]

export const abilities = [
    {
        name: 'no pain',
        label: 'No Pain (Undead)',
        tags: [],
    },
    {
        name: 'immune to poison',
        label: 'Immune to Poison',
        tags: [],
    },
    {
        name: 'hard to kill',
        label: 'Hard to Kill (Dwarf)',
        tags: []
    },
    {
        name: 'hard head',
        label: 'Hard Head (Dwarf)',
        tags: []
    },
    {
        label: 'Susceptible to Sigmarite Hammers/holy weapons',
        name: 'possessed',
        tags: []
    }
]

