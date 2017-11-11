/*~struct~BagPocketStruct:
 * @param Name
 * @text Pocket name
 * @desc The name of the pocket in the Bag screen
 * @type text
 * 
 * @param Slots
 * @text Pocket slots
 * @desc The maximun number of slots in the pocket (-1 for no limit)
 * @type number
 * @default -1
 * @min -1
 * 
 * @param Stack
 * @text Stack size
 * @desc The maximun number of items per slot in the pocket
 * @type number
 * @default 999
 * @min 1
 * @max 999
 * 
 * @param Sort
 * @text Auto sort by id
 * @desc Whether it auto-sorts itself by item ID numbert
 * @type boolean
 * @default false
 */
/*~struct~BagStruct:
 * @param ItemsPocket
 * @text Items
 * @desc Configuration for the "Items" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Items","Slots":"-1","Stack":"999","Sort":"false"}
 * 
 * @param MedsPocket
 * @text Medicine
 * @desc Configuration for the "Medicine" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Medicine","Slots":"-1","Stack":"999","Sort":"false"}
 * 
 * @param BallsPocket
 * @text Poké Balls
 * @desc Configuration for the "Poké Balls" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Poké Balls","Slots":"-1","Stack":"999","Sort":"false"}
 *  
 * @param HMTMPocket
 * @text HM's & TM's
 * @desc Configuration for the "HM's & TM's" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"HM's & TM's","Slots":"-1","Stack":"999","Sort":"true"}
 * 
 * @param BerriesPocket
 * @text Berries
 * @desc Configuration for the "Berries" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Berries","Slots":"-1","Stack":"999","Sort":"true"}
 * 
 * @param MailPocket
 * @text Mail
 * @desc Configuration for the "Mail" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Mail","Slots":"-1","Stack":"999","Sort":"false"}
 * 
 * @param BattlePocket
 * @text Battle Items
 * @desc Configuration for the "Battle Items" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Battle Items","Slots":"-1","Stack":"999","Sort":"false"}
 * 
 * @param KeyPocket
 * @text Key Items
 * @desc Configuration for the "Key Items" bag's pocket
 * @type struct<BagPocketStruct>
 * @default {"Name":"Key Items","Slots":"-1","Stack":"999","Sort":"false"}
 * 
 */
/*~struct~HMRequerimentStruct:
 * @param RequirementMode
 * @text Requirement mode
 * @desc Wether to check for a determined badge or an amount of badges 
 * @type select
 * @option Number of badges
 * @value 0
 * @option Specific badge
 * @value 1
 * 
 * @param RequirementValue
 * @text Requires
 * @desc The badge or an amount of badges required (0 is the first badge, 1 the second...)
 * @type number
 * @default 0
 * @min 0
 * @max 16
 * 
 */
/*~struct~HMRequerimentsStruct:
 * @param HM01Requirement
 * @text HM01 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"1"}
 * 
 * @param HM02Requirement
 * @text HM02 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"2"}
 * 
 * @param HM03Requirement
 * @text HM03 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"3"}
 * 
 * @param HM04Requirement
 * @text HM04 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"4"}
 * 
 * @param HM05Requirement
 * @text HM05 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"5"}
 * 
 * @param HM06Requirement
 * @text HM06 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"6"}
 * 
 * @param HM07Requirement
 * @text HM07 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"7"}
 * 
 * @param HM08Requirement
 * @text HM08 Requirement
 * @desc Required badge(s) for this HM 
 * @type struct<HMRequerimentStruct>
 * @default {"RequirementMode":"0","RequirementValue":"8"}
 * 
 */
/*:
 * @plugindesc Main configuration settings for Pokemon Essentials MV.
 * @author ctrl.alt.supr (git.ctrl.alt.supr@gmail.com)
 *
 * @help This plugin must be placer over all other Pokemon Essentials MV script files.
 *
 * @param CategoryGeneric
 * @text General settings
 * @default ------
 * 
 * @param PBSPath
 * @text PBS.JSON directory
 * @desc Relative path to the place where the RPMMV Essentials pbs.json files are stored.
 * @default PBS
 * @parent CategoryGeneric
 * 
 * @param CategoryPoke
 * @text Pokémon settings
 * @default ------
 *  
 * @param MaximunLevel
 * @text Máximun level
 * @desc The maximum level Pokémon can reach.
 * @type number
 * @default 100
 * @min 1
 * @max 999
 * @parent CategoryPoke
 * 
 * @param EggInitialLevel
 * @text Hatched egg level
 * @desc The level of newly hatched Pokémon.
 * @type number
 * @default 1
 * @min 1
 * @max 999
 * @parent CategoryPoke
 * 
 * @param ShinyChance
 * @text Shiny chance
 * @desc The odds of a newly generated Pokémon being shiny (out of 65536).
 * @type number
 * @default 8
 * @min 0
 * @max 65536
 * @parent CategoryPoke
 * 
 * @param PokerusChance
 * @text Pokerus chance
 * @desc The odds of a wild Pokémon/bred egg having Pokérus (out of 65536).
 * @type number
 * @default 3
 * @min 0
 * @max 65536
 * @parent CategoryPoke
 * 
 * @param CategoryStorage
 * @text Storage settings
 * @default ------
 * 
 * @param StorageCreatorName
 * @text Creator name
 * @desc Storage system creator name (Bill, Aredia...)
 * @default Bill
 * @parent CategoryStorage
 * 
 * @param StorageBoxes
 * @text Number of boxes
 * @desc Number of available storage boxes
 * @type number
 * @default 24
 * @parent CategoryStorage
 * 
 * @param CategoryPokedex
 * @text Pokédex settings
 * @default ------
 * 
 * @param DexDependsOnLocation
 * @text Location aware
 * @desc Whether the Pokédex list shown is the one for the player's current region (true), or whether a menu pops up for the player to manually choose which Dex list to view when appropriate (false).
 * @type boolean
 * @default false
 * @parent CategoryPokedex
 * 
 * @param DexShowAllForms
 * @text Show all forms
 * @desc Whether all forms of a given species will be immediately available to view in the Pokédex so long as that species has been seen at all (true), or whether each form needs to be seen specifically before that form appears in the Pokédex (false).
 * @type boolean
 * @default false
 * @parent CategoryPokedex
 * 
 * @param CategorySwitches
 * @text Switch settings
 * @default ------
 * 
 * @param StartingOverSwitch
 * @text Whiteout switch
 * @desc The Global Switch that is set to ON when the player whites out.
 * @type switch
 * @default 1
 * @parent CategorySwitches
 * 
 * @param SeenPokerusSwitch
 * @text Pokerus switch
 * @desc when the player has seen Pokérus in the Poké Center, and doesn't need to be told about it again.
 * @type switch
 * @default 2
 * @parent CategorySwitches
 * 
 * @param ShinyWildPokemonSwitch
 * @text Shiny switch
 * @desc The Global Switch which, while ON, makes all wild Pokémon created be shiny.
 * @type switch
 * @default 31
 * @parent CategorySwitches
 * 
 * @param FatefulEncounterSwitch
 * @text Whiteout switch
 * @desc The Global Switch which, while ON, makes all Pokémon created considered to be met via a fateful encounter.
 * @type switch
 * @default 32
 * @parent CategorySwitches
 * 
 * @param NoMoneyLossSwitch
 * @text Frugal switch
 * @desc The Global Switch which determines whether the player will lose money if they lose a battle (they can still gain money from trainers for winning).
 * @type switch
 * @default 33
 * @parent CategorySwitches
 * 
 * @param CategoryCombat
 * @text Combat settings
 * @default ------
 * 
 * @param InfiniteTMs
 * @text Infinite TMs
 * @desc Whether TMs can be used infinitely as in Gen 5 (true), or are one-use-only as in older Gens (false).
 * @type boolean
 * @default false
 * @parent CategoryCombat
 * 
 * @param UseMoveCategory
 * @text Use move category
 * @desc Whether a move's physical/special category depends on the move itself as in newer Gens (true), or on its type as in older Gens (false).
 * @type boolean
 * @default true
 * @parent CategoryCombat
 * 
 * @param UseNewBattleMechanics
 * @text Mimic Gen 6
 * @desc Whether the battle mechanics mimic Gen 6 (true) or Gen 5 (false).
 * @type boolean
 * @default false
 * @parent CategoryCombat
 * 
 * @param UseScaledXPFormula
 * @text Scale XP
 * @desc Whether the Exp gained from beating a Pokémon should be scaled depending on the gainer's level as in Gen 5 (true), or not as in other Gens (false).
 * @type boolean
 * @default true
 * @parent CategoryCombat
 * 
 * @param NoSplitXP
 * @text No split XP
 * @desc Whether the Exp gained from beating a Pokémon should be divided equally between each participant (false), or whether each participant should gain that much Exp. This also applies to Exp gained via the Exp Share (held item version) being distributed to all Exp Share holders. This is true in Gen 6 and false otherwise.
 * @type boolean
 * @default false
 * @parent CategoryCombat
 * 
 * @param UseCriticalCapture
 * @text Critical capture
 * @desc Whether the critical capture mechanic applies.
 * @type boolean
 * @default false
 * @parent CategoryCombat
 * 
 * @param GainXPForCapture
 * @text Capture grants XP
 * @desc Whether Pokémon gain Exp for capturing a Pokémon (true) or not (false).
 * @type boolean
 * @default false
 * @parent CategoryCombat
 * 
 * @param CategoryBadges
 * @text Badge settings
 * @default ------
 * 
 * @param BadgesBoostAttack
 * @text Attack boost badges
 * @desc The minimum number of badges required to boost attack of a player's Pokémon by 1.1x, while using moves in battle only.
 * @type number
 * @default 1
 * @parent CategoryBadges
 * 
 * @param BadgesBoostDefense
 * @text Defense boost badges
 * @desc The minimum number of badges required to boost defense of a player's Pokémon by 1.1x, while using moves in battle only.
 * @type number
 * @default 5
 * @parent CategoryBadges
 * 
 * @param BadgesBoostSpeed
 * @text Speed boost badges
 * @desc The minimum number of badges required to boost speed of a player's Pokémon by 1.1x, while using moves in battle only.
 * @type number
 * @default 3
 * @parent CategoryBadges
 * 
 * @param BadgesBoostSPAtk
 * @text SPAtk boost badges
 * @desc The minimum number of badges required to boost spattack of a player's Pokémon by 1.1x, while using moves in battle only.
 * @type number
 * @default 7
 * @parent CategoryBadges
 * 
 * @param BadgesBoostSPDef
 * @text SPDef boost badges
 * @desc The minimum number of badges required to boost spdefense of a player's Pokémon by 1.1x, while using moves in battle only.
 * @type number
 * @default 7
 * @parent CategoryBadges
 * 
 * @param HMRequirements
 * @text HMs requirements
 * @desc HMs badge requirements.
 * @type struct<HMRequerimentsStruct>
 * @parent CategoryBadges
 * 
 * @param CategoryBag
 * @text Bag settings
 * @default ------
 * 
 * @param BagPocketConfig
 * @text Bag pockets
 * @desc Definition for each pocket of the Bag.
 * @type struct<BagStruct>
 * @parent CategoryBag
 * 
 */

var parameters = PluginManager.parameters('PBSettings');
var PBSettings = parameters;
