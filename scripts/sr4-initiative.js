function beginBattle(combat) {
    combat.resetAll();
    combat.rollAll();

    combat.data.round = 1;
    combat.data.turn = 0;
}

function reduceCurrentTurnAndResortTurnOrder(combat) {
    const combatants = [];
    if (combat.combatant.tokenId === null) {
        return;
    }

    for (const combatant of combat.combatants) {
        let init = Number(combatant.initiative);
        if (combatant.tokenId === combat.combatant.tokenId) {
            init = init < 10 ? 0 : init - 10;
        }
        combatants.push(Object.assign({}, combatant, {initiative: init}));
    }

    combatants.sort((a, b) => b.initiative - a.initiative);

    console.error(combatants);

    combat.deleteEmbeddedEntity('Combatant',
        combat.combatants.map((c) => c._id), {});
    combat.createEmbeddedEntity('Combatant', combatants, {});
}

function advanceToNextTurn(combat) {
    for (const combatant of combat.combatants) {
        const actorData = combatant.actor ? combatant.actor.data : {};
        const formula = combat._getInitiativeFormula(combatant);

        const roll = new Roll(formula, actorData).roll();
        combatant.initiative = roll.total;
    }

    combat.rollAll();

    combat.data.round += 1;
    combat.data.turn = 0;
}

/** Overwrites all preUpdateCombat calls to prevent shadowrun5s handler to it's initiative management.
 *
 *  However this means that some aspects of FoundryVtt CombatTracker need bo manually handled.
 *  Due to this, and the
 * TODO: Sort Initiative Order by Reaction and Edge also.
 *
 */
function sr4InitiativeCombatUpdate(combat, changes, options, currentTokenId) {
    console.error('sr4InitiativePreCombatUpdate');

    // Due to us terminating the Hooks chain, we need to start combat manually.
    if (changes.round === 1 && changes.turn === undefined) {
        beginBattle(combat);
    }

    // Reduce current turns initiative and sort.
    if (changes.turn === 1 && combat.combatants.some(combatant => combatant.initiative > 0)) {
        reduceCurrentTurnAndResortTurnOrder(combat);
    }
    // Re-Roll initiative and manually advance round.
    else if (changes.round) {
        advanceToNextTurn(combat);
    }

    // Simulate FoundryVTT Entity preUpdate<> behaviour.
    Hooks.call('updateCombat', combat, changes, options, currentTokenId);

    // Abort Hooks.call chain for this event.
    return false;
}

Hooks.on("preUpdateCombat", sr4InitiativeCombatUpdate);