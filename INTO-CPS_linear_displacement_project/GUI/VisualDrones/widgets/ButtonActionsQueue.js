/**
 * Manages a queue of messages to send to the server
 */
define(function (require, exports, module) {

    var guiActions, instance;
    var FMIClient = require("websockets/FMIClient").getInstance();
    var eventDispatcher = require("util/eventDispatcher");

    function ButtonActionsQueue() {
        guiActions = Promise.resolve();
        this.was_connected = false;
        this.busy = false;
        this.buffer = [];
        return eventDispatcher(this);
    }

    ButtonActionsQueue.prototype.queueGUIAction = function (action, cb, opt) {
        opt = opt || {};
        var _this = this;
        function try_send() {
            if (_this.buffer.length && !_this.busy) {
                _this.busy = true;
                return new Promise(function (resolve, reject) {
                    var elem = _this.buffer.pop();
                    var x = elem.action;
                    var callback = elem.callback;
                    console.log("sending action " + x);
                    try {
                        ws.websocket_send(x, function (err, res) {
                            if (callback) {
                                callback(err, res);
                            }
                            if (err) {
                                reject(err);
                                _this.busy = false;
                                try_send();
                            } else {
                                resolve(res);
                                _this.busy = false;
                            }
                        });
                    } catch(fmi_connection_error) {
                        _this.fire({
                            type: "FMI_CONNECTION_ERROR"
                        });
                        _this.busy = false;
                        try_send();
                    };
                });
            }
        }
        function queue_action() {
            _this.buffer.push({ action: action, callback: cb });
        }
        var ws = FMIClient.getWebSocket();
        cb = cb || function () {};
        if (ws) {
            guiActions = guiActions.then(function (res) {
                if (FMIClient.isWebSocketConnected()) {
                    if (!_this.was_connected) {
                        _this.was_connected = true;
                        _this.fire({
                            type: "FMI_RECONNECTED"
                        });
                    }
                    queue_action();
                    try_send();
                } else {
                    _this.was_connected = false;
                    _this.fire({
                        type: "FMI_TRYING_TO_CONNECT"
                    });
                    FMIClient.connectToServer().then(function (res) {
                        queue_action();
                        try_send();
                    });
                }
            });
        }
    };

    module.exports = {
        getInstance: function () {
            instance = instance || new ButtonActionsQueue();
            return instance;
        }
    };
});
