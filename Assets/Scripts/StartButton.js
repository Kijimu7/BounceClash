//@input Component.InteractionComponent interaction
//@input Component.ScriptComponent gameController

function onTapped() {
    if (script.gameController && script.gameController.api && script.gameController.api.startGame) {
        script.gameController.api.startGame();
    }
}

script.interaction.onTap.add(onTapped);