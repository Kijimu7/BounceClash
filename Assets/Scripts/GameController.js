//@input Component.ScriptComponent[] MoveTowardsPlayer
//@input Component.Text StartButton


function startGame() {

//Enable movetowardsplayer script
    for (var i = 0; i < script.MoveTowardsPlayer.length; i++) {
    var sc = script.MoveTowardsPlayer[i];
    if (!sc) {
        continue;
    }
    sc.enabled = true;

    script.StartButton.enabled = false;
}

}

script.api.startGame = startGame;  // expose it

// NPCs to watch
// @input SceneObject[] npcs

// Y position at which we consider the NPC "fallen off the ground"
// Example: if your ground is around Y = 0, use -5 or -10
// @input float fallY = -10.0 {"label":"Fall Threshold Y"}

// Starting score
// @input int score = 0 {"label":"Starting Score"}

// How many points to add each time an NPC falls
// @input int pointsPerFall = 1 {"label":"Points Per Fall"}

// Optional: Text component to display the score
// @input Component.Text scoreText {"label":"Score Text", "hint":"Optional"}

// Internal state
var currentScore = script.score;
// hasFallen[i] tracks if npcs[i] is currently considered "fallen"
var hasFallen = [];

function init() {
    // Initialize hasFallen flags
    if (script.npcs) {
        for (var i = 0; i < script.npcs.length; i++) {
            hasFallen[i] = false;
        }
    }

    updateScoreText();

    // Check NPC positions every frame
    script.createEvent("UpdateEvent").bind(onUpdate);

    // Expose API so other scripts can change the score
    script.api.addPoints = addPoints;
    script.api.setScore = setScore;
    script.api.getScore = function () {
        return currentScore;
    };
}

function onUpdate() {
    if (!script.npcs) {
        return;
    }

    for (var i = 0; i < script.npcs.length; i++) {
        var npc = script.npcs[i];
        if (!npc) {
            continue;
        }

        var npcTransform = npc.getTransform();
        var npcY = npcTransform.getWorldPosition().y;

        // NPC just fell below the threshold
        if (!hasFallen[i] && npcY < script.fallY) {
            hasFallen[i] = true;
            addPoints(script.pointsPerFall);
        }

        // Reset flag if NPC comes back above the threshold
        if (hasFallen[i] && npcY >= script.fallY) {
            hasFallen[i] = false;
        }
    }
}

function addPoints(amount) {
    currentScore += amount;
    updateScoreText();
}

function setScore(value) {
    currentScore = value;
    updateScoreText();
}

function updateScoreText() {
    if (script.scoreText) {
        script.scoreText.text = currentScore.toString();
    }
}

init();