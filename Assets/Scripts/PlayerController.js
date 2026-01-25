// MovementAndFallController.js

// @input SceneObject sphere
// @input Component.ScriptComponent joystick
// @input float moveSpeed = 200.0

// Gravity (negative value, cm/s^2)
// @input float gravity = -300.0

// Start falling when we are "past" this Z (example trigger)
// Change/remove this once you switch to your own condition.
// @input bool useZTrigger = true
// @input float fallStartZ = 150.0 {"showIf":"useZTrigger","showIfValue":true}

// Optional rectangular gap instead of Z trigger
// @input bool useGap = false
// @input float gapMinX = -50.0 {"showIf":"useGap","showIfValue":true}
// @input float gapMaxX = 50.0  {"showIf":"useGap","showIfValue":true}
// @input float gapMinZ = 100.0 {"showIf":"useGap","showIfValue":true}
// @input float gapMaxZ = 200.0 {"showIf":"useGap","showIfValue":true}

// Optional kill height
// @input bool useKillY = false
// @input float killY = -500.0 {"showIf":"useKillY","showIfValue":true}

var sphereObj = script.sphere || script.getSceneObject();
var sphereTransform = sphereObj.getTransform();

// Ground height: use the sphere's starting center Y so it doesn't sink
var groundY = sphereTransform.getWorldPosition().y;

// vertical state
var isFalling = false;
var verticalVel = 0.0;

script.createEvent("UpdateEvent").bind(onUpdate);

function onUpdate() {
    var dt = getDeltaTime();
    if (dt <= 0) {
        return;
    }

    if (!script.joystick || !script.joystick.api || !script.joystick.api.direction) {
        return;
    }

    var pos = sphereTransform.getWorldPosition();

    // ---------- 1) Horizontal movement from joystick ----------
    var dir2 = script.joystick.api.direction; // vec2 in [-1,1]

    if (Math.abs(dir2.x) > 0.01 || Math.abs(dir2.y) > 0.01) {
        var moveDir = new vec3(dir2.x, 0, -dir2.y); // x, -y -> X,Z
        moveDir = moveDir.normalize();
        pos = pos.add(moveDir.uniformScale(script.moveSpeed * dt));
    }

    // ---------- 2) Decide if we should start falling ----------

    // Example A: simple Z trigger
    if (!isFalling && script.useZTrigger && pos.z > script.fallStartZ) {
        isFalling = true;
        verticalVel = 0.0;
        // print("Start falling: crossed Z trigger");
    }

    // Example B: rectangular gap
    if (!isFalling && script.useGap) {
        var overGap =
            pos.x > script.gapMinX && pos.x < script.gapMaxX &&
            pos.z > script.gapMinZ && pos.z < script.gapMaxZ;

        if (overGap) {
            isFalling = true;
            verticalVel = 0.0;
            // print("Start falling: over gap");
        }
    }

    // ---------- 3) Vertical motion (grounded vs falling) ----------

    if (isFalling) {
        // gravity
        verticalVel += script.gravity * dt;
        pos.y += verticalVel * dt;

        if (script.useKillY && pos.y < script.killY) {
            pos.y = script.killY;
            verticalVel = 0.0;
        }
    } else {
        // grounded: keep center at initial height
        pos.y = groundY;
        verticalVel = 0.0;
    }

    sphereTransform.setWorldPosition(pos);
}