// Event: Update

//@input SceneObject sphere
//@input SceneObject player
//@input float speed = 50.0

var sphereTransform = script.sphere.getTransform();
var playerTransform = script.player.getTransform();

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function() {
    var dt = getDeltaTime();

    var spherePos = sphereTransform.getWorldPosition();
    var playerPos = playerTransform.getWorldPosition();

    var step = script.speed * dt;

    // Make a target with player's X/Z but sphere's current Y (ground height)
    var flatTarget = new vec3(playerPos.x, spherePos.y, playerPos.z);

    var newPos = spherePos.moveTowards(flatTarget, step);
    sphereTransform.setWorldPosition(newPos);
});



