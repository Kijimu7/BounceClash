// NpcRideBall.js
// Event: Lens Initialized

//@input SceneObject sphere   // the ball object
//@input SceneObject player   // the player object
//@input float yawOffsetDegrees = 0.0   // tweak in Inspector if model faces sideways/backwards

if (!script.sphere) {
    print("NpcRideBall: sphere input not set");
    return;
}
if (!script.player) {
    print("NpcRideBall: player input not set");
    return;
}

var npcTransform = script.getSceneObject().getTransform();
var sphereTransform = script.sphere.getTransform();
var playerTransform = script.player.getTransform();

// Cache initial offset from ball (world space)
var initialOffset = npcTransform.getWorldPosition().sub(sphereTransform.getWorldPosition());

// Simple timer to avoid log spam
var logTimer = 0;

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function () {
    var dt = getDeltaTime();
    logTimer += dt;

    // 1) Follow the ball's position with the same offset
    var spherePos = sphereTransform.getWorldPosition();
    var npcPos = spherePos.add(initialOffset);
    npcTransform.setWorldPosition(npcPos);

    // 2) Look towards player horizontally (stay upright)
    var playerPos = playerTransform.getWorldPosition();

    var toPlayer = playerPos.sub(npcPos);
    toPlayer.y = 0; // ignore vertical difference

    var dist = toPlayer.length;
    if (dist <= 0.0001) {
        return; // too close / same position
    }

    var forward = toPlayer.normalize();
    var lookRot = quat.lookAt(forward, vec3.up());

    var yawRad = script.yawOffsetDegrees * Math.PI / 180.0;
    var yawOffset = quat.fromEulerAngles(0, yawRad, 0);
    var finalRot = yawOffset.multiply(lookRot);

    npcTransform.setWorldRotation(finalRot);

    // Debug once per second
    if (logTimer > 1.0) {
        logTimer = 0;
        var euler = finalRot.toEulerAngles();
        // print("NpcRideBall: toPlayer = " + toPlayer.toString()
        //     + ", yawOffset = " + script.yawOffsetDegrees
        //     + ", euler = " + euler.toString());
    }
});