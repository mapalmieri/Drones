/**
 * @module FMIClient / implementation based on PVSiowebClient
 * @author Paolo Masci
 * @date April 24, 2017
 */
define(function (require, exports, module) {
    "use strict";
    var pvsws                   = require("websockets/pvs/pvsWSClient"),
		eventDispatcher			= require("util/eventDispatcher"),
		d3						= require("d3/d3"),
		property				= require("util/property"),
		ws,
		_port = 8090,
		url = window.location.href.indexOf("file") === 0 ?
				("ws://localhost") : ("ws://" + window.location.hostname),
        instance;

	/**
	 * Creates a new websocket client.
	 * @constructor
	 */
	function PVSioWeb() {
		eventDispatcher(this);
		var _pvsioweb = this;
		//create pvs websocket connection
		//add listeners for pvs process events
		ws = pvsws()
			.serverUrl(url)
			.addListener('ConnectionOpened', function (e) {
                e.type = "WebSocketConnectionOpened";
				_pvsioweb.isWebSocketConnected(true).fire(e);
			}).addListener("ConnectionClosed", function (e) {
                e.type = "WebSocketConnectionClosed";
				_pvsioweb.isWebSocketConnected(false).fire(e);
			}).addListener("pvsoutput", function (e) {
				_pvsioweb.fire(e);
			}).addListener("processExited", function (e) {
				_pvsioweb.isPVSProcessConnected(false).fire(e);
			});
	}
    /**
     * Get or set whether the client is connected to the server websocket
     */
    PVSioWeb.prototype.isWebSocketConnected = property.call(PVSioWeb.prototype, false);
    /**
     * Get or set whether the client is connected to the server pvsprocess
     */
    PVSioWeb.prototype.isPVSProcessConnected = property.call(PVSioWeb.prototype, false);
    /**
     * Get or set the port for the server connection
     */
	PVSioWeb.prototype.port = property.call(PVSioWeb.prototype, _port);
    /**
     * Get or set the url for the server connection
     */
	PVSioWeb.prototype.serverUrl = property.call(PVSioWeb.prototype, url);
    /**
     * Checks whether the server is running on localhost
     */
	PVSioWeb.prototype.serverOnLocalhost = function () { return url.indexOf("ws://localhost") === 0; };
	/**
        Initiate connection to the server.
        Returns a promise object that resolves to the websocket connection when the connection opens
    */
	PVSioWeb.prototype.connectToServer = function () {
		if (this.isWebSocketConnected()) {
			return Promise.resolve(this.getWebSocket());
		} else {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.port()) {
                    ws.serverUrl(_this.serverUrl()).port(_this.port()).logon().then(function (res) {
                        resolve(res);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    return ws.serverUrl(_this.serverUrl()).logon().then(function (res) {
                        resolve(res);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
            });
        }
	};

    /**
     * Disconnects from the server
     */
	PVSioWeb.prototype.disconnectFromServer = function () {
		ws.close();
		return this;
	};
	/**
     * Get the websocket connection
     */
	PVSioWeb.prototype.getWebSocket = function () { return ws; };

    /**
     * APIs
     */
	module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PVSioWeb();
            }
            return instance;
        }
    };
});
