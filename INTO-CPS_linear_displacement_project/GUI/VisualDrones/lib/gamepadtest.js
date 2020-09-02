var hasGP = false;
var repGP;

var stick_direction = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
};

var button_map = {
    "0": "Y",
    "1": "B",
    "2": "A",
    "3": "X"
};

function get_nav_direction(gp) {
    if (gp && gp.axes && gp.axes.length >= 2) {
        if (gp.axes[0] === stick_direction.up[0] && gp.axes[1] === stick_direction.up[1]) {
            $(window).trigger("gamepad_up");
            return "up";
        } else if (gp.axes[0] === stick_direction.down[0] && gp.axes[1] === stick_direction.down[1]) {
            $(window).trigger("gamepad_down");
            return "down";
        } else if (gp.axes[0] === stick_direction.left[0] && gp.axes[1] === stick_direction.left[1]) {
            $(window).trigger("gamepad_left");
            return "left";
        } else if (gp.axes[0] === stick_direction.right[0] && gp.axes[1] === stick_direction.right[1]) {
            $(window).trigger("gamepad_right");
            return "right";
        }
    }
    return null;
}

function get_button(gp) {
    for(var i = 0; i < gp.buttons.length; i++) {
        if(gp.buttons[i].pressed) {
            var b = button_map[i] || i;
            b = "gamepad_" + b;
            $(window).trigger(b);
            return b;
        }
    }
    return null;
}

function canGame() {
    return "getGamepads" in navigator;
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var btn = get_button(gp);
    if (btn) {
        console.log("Button " + btn);
    }
    for(var i = 0; i < gp.axes.length; i += 2) {
        var nav = get_nav_direction(gp);
        if (nav) {
            console.log("Navigation " + nav);
        }
    }
}

$(document).ready(function() {
    if(canGame()) {
        console.log("To begin using your gamepad, connect it and press any button!");
        $(window).on("gamepadconnected", function() {
            hasGP = true;
            console.log("Gamepad connected!");
            reportOnGamepad();
            repGP = window.setInterval(reportOnGamepad, 250);
        });

        $(window).on("gamepaddisconnected", function() {
            console.log("Gamepad disconnected :/");
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) {
                    $(window).trigger("gamepadconnected");
                }
                window.clearInterval(checkGP);
            }
        }, 1000);
    }
});
