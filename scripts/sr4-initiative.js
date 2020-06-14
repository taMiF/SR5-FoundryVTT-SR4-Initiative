/** TODO: Documentation
 *
 */

const sr4InitiativePreCombatUpdate = (combat, changes) => {
    console.error('Hallo', combat, changes);
};

Hooks.on("preCombatUpdate", sr4InitiativePreCombatUpdate);