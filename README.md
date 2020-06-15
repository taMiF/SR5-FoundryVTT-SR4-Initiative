# SR5-FoundryVTT-SR4-Initiative
Use Shadowrun 4th style initiative for the Shadowrun 5th system for FoundryVTT.

This module is currently meant for personal use. If you really want to use it, do so with extreme care. Backup your world.

This Module will overwrite default Combat Tracker behaviour of SR5-FoundryVTT system.

Instead of reducing all combatants initiative result after each acted once (Initiative Phase), each combatants initiative result will
immediately be reduced and combat order will proceed again with the highest initiative result. This can result in the same
combatant acting multiple times before the next combatant can act.


## Known Issues
* Will highjack all modules that make use of the preUpdateCombat hook (Turn Marker and others)
* Going backwards (round or turn) doesn't work and will break the current combat tracker. Don't do it.
