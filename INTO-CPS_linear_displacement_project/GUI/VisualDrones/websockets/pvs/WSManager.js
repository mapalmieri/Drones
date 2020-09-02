/**
 * simple websocket connection manager
 * @author Paolo Masci
 * @date 6/20/13 10:45:57 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var ws;

    module.exports = {
        getWebSocket: function () {
            if (!ws) {
                ws = new WebSocket("ws://localhost:8084");
            }
            ws.onopen = function (event) {
                connected();
            };
            ws.onerror = function (event) {
                disconnected();
                console.log(event);
            };
            ws.onclose = function (event) {
                disconnected();
                ws = null;
            };
            ws.onmessage = function (event) {
                message_received(event);
            };
            return ws;
        }
    };
});
