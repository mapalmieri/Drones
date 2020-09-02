require.config({
    baseUrl: "./",
    paths: { d3: "./lib", text: "./lib/text" }
});

require([
    "widgets/ButtonActionsQueue",
    "websockets/FMIClient"
], function (ButtonActionsQueue, FMIClient) {
    "use strict";

    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    system.blue_drone = d3.select("#blue_drone");
    system.yellow_drone = d3.select("#yellow_drone");
    system.green_drone = d3.select("#green_drone");
    system.red_drone = d3.select("#red_drone");
    system.pink_drone = d3.select("#pink_drone");
    
    system.collision_detect = false;

    function onMessageReceived(err, res) {
        var state = PVSioStateParser.parse(res);
        var pos = {
            blue_drone: { x: PVSioStateParser.evaluate(state.x1) , y: PVSioStateParser.evaluate(state.z1)  },
            yellow_drone: { x: PVSioStateParser.evaluate(state.x2) , y: PVSioStateParser.evaluate(state.z2)  },
            green_drone: { x: PVSioStateParser.evaluate(state.x3) , y: PVSioStateParser.evaluate(state.z3)  },
            red_drone: { x: PVSioStateParser.evaluate(state.x4) , y: PVSioStateParser.evaluate(state.z4)  },
            pink_drone: { x: PVSioStateParser.evaluate(state.x5) , y: PVSioStateParser.evaluate(state.z5)  }
        };

        // don't use the Navigator widget, just move the drones with the following command.
        			
			
			system.blue_drone.style("left", 100+pos.blue_drone.x*100 + "px").style("top", 400-pos.blue_drone.y*100 + "px").style("transition-duration",250+"ms");
			system.red_drone.style("left", 100+pos.red_drone.x*100 + "px").style("top", 400-pos.red_drone.y*100 + "px").style("transition-duration",250+"ms");
			system.yellow_drone.style("left", 100+pos.yellow_drone.x*100 + "px").style("top", 400-pos.yellow_drone.y*100 + "px").style("transition-duration",250+"ms");
			system.green_drone.style("left", 100+pos.green_drone.x*100 + "px").style("top", 400-pos.green_drone.y*100 + "px").style("transition-duration",250+"ms");
			system.pink_drone.style("left", 100+pos.pink_drone.x*100 + "px").style("top", 400-pos.pink_drone.y*100 + "px").style("transition-duration",250+"ms");
		
		//assume drone start far enough
		if (system.collision_detect){
			system.green_drone.style("transform", "rotate(130deg)").style("top", 600+"px").style("transition-duration",2000+"ms");
			system.yellow_drone.style("transform", "rotate(210deg)").style("top", 600+"px").style("transition-duration",2000+"ms");
			stop_tick();
		}
		// 3 drones moving, only the middle one (green) can collide
		else if(((Math.abs(pos.green_drone.x-pos.yellow_drone.x) < 0.7) || (Math.abs(pos.green_drone.x-pos.red_drone.x) < 0.7)) && (Math.abs(pos.green_drone.y-pos.yellow_drone.y) < 0.5)){ 
		system.collision_detect=true;
		}
		
		
		console.log(pos);
    }

    // web socket client
    var client = FMIClient.getInstance();
   
     var tick;
        function start_tick(interval) {
            if (!tick) {
                tick = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        start_tick(250);
});
