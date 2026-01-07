export const PLAYER_IN_RUSH = 40;
export const UPDATE_INTERVAL_MS = 10000;
export const SEND_PLAYER_STATUS_UPDATE_INTERVAL_MS = 30000;
export const RESET_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
export const CHARACTER_DEATH_PROBABILITY = 0.001;
export const CHARACTER_EARN_GOLD_PROBABILITY = 0.01;
export const CHARACTER_EQUIP_ITEM_PROBABILITY = 0.02;
export const CHARACTER_FORGOT_PROFESSION_PROBABILITY = 0.002;
export const CHARACTER_JOINED_RUSH_PROBABILITY = 1; // if no alive character for the player
export const CHARACTER_LEARN_PROFESSION_PROBABILITY = 0.02;
export const CHARACTER_LEVELUP_PROBABILITY = 0.01;
export const CHARACTER_LOST_GOLD_PROBABILITY = 0.01;
export const CHARACTER_PROFESSION_LEVELUP_PROBABILITY = 0.01;
export const CHARACTER_REMOVED_ITEM_PROBABILITY = 0.01;
export const CHARACTER_RENAME_PROBABILITY = 0.001;
export const CHARACTER_TEAM_CHANGE_PROBABILITY = 0.001;
export const CHARACTER_KILL_BOSS_PROBABILITY = 0.005;
export const CHARACTER_ZONE_CHANGE_PROBABILITY = 0.008;

// FRAUD
export const MAIL_GOLD_TAKEN_PROBABILITY = 0.005;
export const MAIL_ITEMS_PROBABILITY = 0.002;
export const TRADE_GOLD_RECEIVED_PROBABILITY = 0.005;
export const TRADE_ITEMS_PROBABILITY = 0.002;

export const TEAMS = [
  'FRENCH_TEAM',
  'GERMAN_TEAM',
  'ITALIAN_TEAM',
  'ENGLISH_TEAM',
];

export const PROFESSION_IDS = [1, 2, 3, 4, 5, 9, 10, 11, 12];
export const CLASS_IDS = [1, 2, 3, 4, 5, 7, 8, 9, 11];
export const ITEM_STUFF_IDS = [
  10504, 10567, 10570, 10571, 10573, 10574, 10581, 10582, 10583, 10584, 10623,
  10624, 10625, 10626, 10627, 10628, 10630, 10631, 10632, 10633, 10634, 10710,
  10711, 10749, 10750, 10758, 10761, 10762, 10763, 10764, 10766, 10767, 10768,
  10769, 10770, 10771, 10774, 10775, 10776, 10777, 10783, 10784, 10787,
];

export const MAP_IDS = [
  1, 33, 34, 36, 43, 47, 48, 70, 90, 109, 129, 209, 859, 230, 329, 349, 389,
  429, 1004, 1007, 409, 469, 509, 531, 533, 947, 1411, 1412, 1413, 1414, 1415,
  1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428,
  1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441,
  1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454,
  1455, 1456, 1457, 1458, 466, 475, 465, 477, 479, 473, 481, 478, 467, 269, 540,
  542, 543, 545, 546, 547, 552, 553, 554, 555, 556, 557, 558, 560, 585, 532,
  534, 544, 548, 550, 564, 565, 580,
];

export const ITEM_REAGENTS_IDS = [
  2771, // Copper Ore
  2772, // Tin Ore
  2773, // Iron Ore
  2776, // Silver Ore
  2777, // Gold Ore
  3858, // Mageroyal
  3356, // Kingsblood
  3357, // Liferoot
  3369, // Hochenblume (Wild Steelbloom)
  3355, // Wild Steelbloom
  3820, // Stranglekelp
  3821, // Briarthorn
  8831, // Purple Lotus
  8836, // Arthas’ Tears
  8838, // Sungrass
  13463, // Dreamfoil
  13464, // Golden Sansam
  13465, // Mountain Silversage
  13466, // Sorrowmoss
  1705, // Lesser Moonstone
  17012, // Greater Moonstone
  774, // Malachite
  818, // Tigerseye
  1206, // Moss Agate
  1210, // Shadowgem
  1529, // Jade
  7912, // Truesilver Bar
  2840, // Bronze Bar
  2841, // Silver Bar
  3575, // Iron Bar
  3859, // Mithril Ore
  3860, // Mithril Bar
  7911, // Solid Stone
  12365, // Green Iron Ore
  12359, // Thorium Ore
  12361, // Oily Blackmouth
  1705, // Lesser Moonstone
  18240, // Enchanted Thorium Bar
  12799, // Large Brilliant Shard
  11138, // Small Brilliant Shard
  11139, // Large Brilliant Shard
  10938, // Lesser Magic Essence
  10939, // Greater Magic Essence
  11084, // Large Glimmering Shard
  11083, // Soul Dust
  11082, // Greater Astral Essence
  11134, // Lesser Nether Essence
  11135, // Greater Nether Essence
  12361, // Thorium Ore
  7068, // Elemental Earth
  7067, // Elemental Water
  7069, // Elemental Fire
  7068, // Elemental Earth
  7070, // Elemental Air
  7080, // Heart of Fire
  7078, // Essence of Earth
  7082, // Essence of Fire
  7081, // Essence of Water
  7909, // Elemental Water (duplicate in Classic)
  12803, // Large Radiant Shard
  7972, // Ichor of Undeath
  12364, // Huge Emerald
  7909, // Elemental Water (Legacy)
];

export const BOSS_IDS = [
  11519, 3654, 639, 4275, 1716, 4829, 7800, 4421, 4543, 6487, 3975, 3976, 7358,
  2748, 7267, 12201, 11502, 14834, 11583, 15990, 15727, 15339, 10184,
];

export const namePrefixes = [
  'Ael',
  'Aer',
  'Ald',
  'Ard',
  'Bael',
  'Bar',
  'Bel',
  'Cal',
  'Cor',
  'Dael',
  'Dor',
  'Drak',
  'Eld',
  'Elr',
  'Fal',
  'Fen',
  'Gal',
  'Gar',
  'Hal',
  'Hel',
  'Isk',
  'Jor',
  'Kael',
  'Kor',
  'Lyr',
  'Mal',
  'Mor',
  'Nar',
  'Oth',
  'Rha',
  'Riv',
  'Sar',
  'Sel',
  'Tal',
  'Thal',
  'Tor',
  'Ul',
  'Var',
  'Vor',
  'Yor',
  'Zar',
  'Cyber',
  'Neo',
  'Proto',
  'Meta',
  'Hyper',
  'Nano',
  'Quantum',
  'Flux',
  'Cryo',
  'Holo',
  'Byte',
  'Data',
  'Opti',
  'Alpha',
  'Beta',
  'Gamma',
  'Omega',
  'Zero',
  'Pulse',
  'Sync',
  'Core',
  'Logic',
  'Nexo',
  'Astro',
  'Geo',
  'Vecto',
  'Hexa',
  'Octa',
  'Tri',
  'Mono',
  'Synthetic',
  'Ultra',
  'Bio',
  'Mecha',
  'Phantom',
  'Inter',
  'Infra',
  'Para',
  'Sub',
  'Supra',
  'North',
  'South',
  'East',
  'West',
  'Prime',
  'Central',
  'First',
  'Union',
  'Global',
  'United',
  'Front',
  'Bright',
  'Clear',
  'Silver',
  'Golden',
  'Iron',
  'Stone',
  'River',
  'Mountain',
  'Valley',
  'Sky',
  'Star',
  'Red',
  'Blue',
  'Green',
  'Black',
  'White',
  'Open',
  'Next',
  'True',
  'Solid',
  'Sharp',
  'Bold',
  'Rapid',
  'High',
  'Low',
  'Wide',
  'Noble',
  'Grand',
  'Capital',
  'Metro',
  'Urban',
  'Rural',
  'Classic',
  'Modern',
  'Apex',
  'Vertex',
  'Nexus',
  'Origin',
  'Epsilon',
  'Delta',
  'Sigma',
  'Arc',
  'Vector',
  'Shift',
  'Echo',
  'Spectra',
  'Nova',
  'Aura',
  'Myth',
  'Prism',
  'Zen',
  'Pulse',
  'Halo',
  'Chaos',
  'Order',
  'Phase',
  'Frame',
  'Realm',
  'Cycle',
  'Focus',
  'Flux',
  'Bound',
  'Path',
  'Scale',
  'Mode',
  'State',
  'Core',
  'Layer',
  'Mirth',
  'Glyph',
  'Rune',
  'Shard',
  'Ember',
  'Frost',
  'Dust',
  'Void',
  'Ether',
  'Solar',
  'Lunar',
  'Cosmic',
  'Astral',
  'Prime',
];
export const nameSuffixes = [
  'dor',
  'mir',
  'dun',
  'thor',
  'gar',
  'gorn',
  'drim',
  'vorn',
  'thas',
  'nar',
  'lorn',
  'wyn',
  'drel',
  'mar',
  'driel',
  'tar',
  'thir',
  'kar',
  'grim',
  'zun',
  'vara',
  'thiel',
  'drake',
  'lith',
  'ran',
  'dane',
  'wynne',
  'tharn',
  'kor',
  'dus',
  'mirra',
  'X',
  'Core',
  'Tech',
  'Lab',
  'Node',
  'Byte',
  'Works',
  'Hub',
  'Station',
  'Drive',
  'Engine',
  'OS',
  'System',
  'Protocol',
  'Module',
  'Stream',
  'Flux',
  'Unit',
  'Logic',
  'Matrix',
  'Frame',
  'Pulse',
  'Layer',
  'Scope',
  'Shift',
  'Zone',
  'Circuit',
  'Flow',
  'Field',
  'Prime',
  'Net',
  'Sector',
  'Array',
  'Cluster',
  'Vector',
  'Deck',
  'Link',
  'Hive',
  'Corp',
  'Group',
  'Labs',
  'Studio',
  'Solutions',
  'Industries',
  'Systems',
  'Agency',
  'Partners',
  'Collective',
  'Company',
  'Soft',
  'Works',
  'Media',
  'Network',
  'Digital',
  'Interactive',
  'Design',
  'Consulting',
  'Services',
  'Dynamics',
  'Enterprise',
  'Global',
  'Holdings',
  'Capital',
  'Factory',
  'Forge',
  'House',
  'Office',
  'Council',
  'Guild',
  'Crew',
  'Union',
  'Sphere',
  'Realm',
  'Verse',
  'Scope',
  'Point',
  'Mode',
  'Cycle',
  'Arc',
  'Frame',
  'Edge',
  'Wave',
  'Phase',
  'Shift',
  'Ray',
  'Light',
  'Shade',
  'Aspect',
  'Flow',
  'Spark',
  'Fragment',
  'Seed',
  'Path',
  'Pattern',
  'Origin',
  'Nexus',
  'Echo',
  'Aura',
  'Drift',
  'Core',
  'Pulse',
  'Prime',
  'Layer',
  'Trail',
  'Step',
  'Scale',
  'Bound',
  'Gate',
  'Field',
];
