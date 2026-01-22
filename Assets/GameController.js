// // Event: Update

// //@input SceneObject sphere
// //@input SceneObject player
// //@input float speed = 50.0         // chase speed
// //@input float fallSpeed = 300.0    // how fast it falls
// //@input float fallY = -50.0        // when below this, switch to falling

// var sphereTransform = script.sphere.getTransform();
// var playerTransform = script.player.getTransform();

// // Cache the ground height once (sphere's initial Y)
// var groundY = sphereTransform.getWorldPosition().y;

// // State flag
// var isFalling = false;

// var updateEvent = script.createEvent("UpdateEvent");
// updateEvent.bind(function() {
//     var dt = getDeltaTime();
//     var spherePos = sphereTransform.getWorldPosition();

//     // If already falling: go straight down, no following
//     if (isFalling) {
//         spherePos.y -= script.fallSpeed * dt;
//         sphereTransform.setWorldPosition(spherePos);
//         return;
//     }

//     var playerPos = playerTransform.getWorldPosition();
//     var step = script.speed * dt;

//     // Follow only on X/Z at fixed ground height
//     var flatTarget = new vec3(playerPos.x, groundY, playerPos.z);
//     var newPos = spherePos.moveTowards(flatTarget, step);
//     newPos.y = groundY;
//     sphereTransform.setWorldPosition(newPos);

//     // Condition to start falling:
//     // if it gets pushed below the ground line, or drops off some ledge, etc.
//     if (spherePos.y < groundY - 0.1 || spherePos.y < script.fallY) {
//         isFalling = true;
//     }
// });



// //@input SceneObject sphere
// //@input SceneObject player
// //@input float speed = 50.0

// var sphereTransform = script.sphere.getTransform();
// var playerTransform = script.player.getTransform();

// // Cache ground Y once
// var groundY = sphereTransform.getWorldPosition().y;

// var updateEvent = script.createEvent("UpdateEvent");
// updateEvent.bind(function() {
//     var dt = getDeltaTime();

//     var spherePos = sphereTransform.getWorldPosition();
//     var playerPos = playerTransform.getWorldPosition();

//     var step = script.speed * dt;

//     // Move only on X/Z
//     var flatTarget = new vec3(playerPos.x, groundY, playerPos.z);
//     var newPos = spherePos.moveTowards(flatTarget, step);
//     newPos.y = groundY;

//     // --- ROLLING CALCULATION ---
//     var delta = newPos.sub(spherePos);
//     var distance = delta.length;

//     if (distance > 0.0001) {
//         var moveDir = delta.normalize();
//         var up = vec3.up(); // ground normal
//         var rollAxis = moveDir.cross(up).normalize(); // roll axis

//         // Approx radius from world scale (assuming uniform sphere)
//         var radius = sphereTransform.getWorldScale().x * 0.5;

//         var angle = distance / radius; // radians

//         var currentRot = sphereTransform.getWorldRotation();
//         var deltaRot = quat.angleAxis(angle, rollAxis);

//         // Apply new rotation
//         sphereTransform.setWorldRotation(deltaRot.multiply(currentRot));
//     }
//     // --- END ROLLING ---

//     sphereTransform.setWorldPosition(newPos);
// });


// Event: Update

//@input SceneObject sphere
//@input SceneObject player
//@input float speed = 50.0         // chase speed
//@input float fallSpeed = 300.0    // how fast it falls
//@input float fallThreshold = 0.1  // how far below ground before it starts falling

var sphereTransform = script.sphere.getTransform();
var playerTransform = script.player.getTransform();

// Cache the ground height once (sphere's initial Y)
var groundY = sphereTransform.getWorldPosition().y;

// State flag
var isFalling = false;

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function () {
    var dt = getDeltaTime();
    var spherePos = sphereTransform.getWorldPosition();

    // 1) Check if we should start falling BEFORE clamping to ground or rolling
    if (!isFalling && spherePos.y < groundY - script.fallThreshold) {
        isFalling = true;
    }

    // 2) Falling mode: straight down, no following, no rolling
    if (isFalling) {
        spherePos.y -= script.fallSpeed * dt;
        sphereTransform.setWorldPosition(spherePos);
        return;
    }

    // 3) Ground chase + rolling

    var playerPos = playerTransform.getWorldPosition();
    var step = script.speed * dt;

    // Follow only on X/Z, at ground height
    var flatTarget = new vec3(playerPos.x, groundY, playerPos.z);
    var newPos = spherePos.moveTowards(flatTarget, step);
    newPos.y = groundY;

    // Rolling: rotate based on how far we just moved
    var delta = newPos.sub(spherePos);
    var distance = delta.length;

    if (distance > 0.0001) {
        var moveDir = delta.normalize();
        var up = vec3.up();
        var rollAxis = up.cross(moveDir).normalize();  // if rolling backwards, swap to up.cross(moveDir)

        // Approx sphere radius from world scale (assuming uniform sphere)
        var radius = sphereTransform.getWorldScale().x * 0.5;
        var angle = distance / radius; // radians

        var currentRot = sphereTransform.getWorldRotation();
        var deltaRot = quat.angleAxis(angle, rollAxis);
        sphereTransform.setWorldRotation(deltaRot.multiply(currentRot));
    }

    sphereTransform.setWorldPosition(newPos);
});



