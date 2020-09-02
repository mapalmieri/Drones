/**
 * @module Navigator
 * @version 1.0
 * @description
 * Simple car navigation display with path trace
 *
 * @author Paolo Masci
 * @date May 11, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3_gauge_plus*/
define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3");
    var Widget = require("widgets/Widget"),
        property = require("util/property");

    var colors = [
        "steelblue",
        "red",
        "green",
        "blue",
        "darkblue",
        "darkorange",
        "darkviolet",
        "firebrick",
        "indianred",
        "grey",
        "magenta",
        "mediumspringgreen",
        "black",
        "saddlebrown",
        "tan",
        "violet",
        "yellow",
        "hotpink"
    ];
    var maxC = colors.length;

    /**
     * @function <a name="Navigator">Navigator</a>
     * @description Navigator constructor.
     * @param id {String} The ID of the element that will contain the gauge.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *          - interpolation:
                    basis - a B-spline, with control point duplication on the ends. (DEFAULT)
                    basis-open - an open B-spline; may not intersect the start or end.
                    basis-closed - a closed B-spline, as in a loop.
                    linear - piecewise linear segments, as in a polyline.
                    linear-closed - close the linear segments to form a polygon.
                    step-before - alternate between vertical and horizontal segments, as in a step function.
                    step-after - alternate between horizontal and vertical segments, as in a step function.
                    bundle - equivalent to basis, except the tension parameter is used to straighten the spline.
                    cardinal - a Cardinal spline, with control point duplication on the ends.
                    cardinal-open - an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
                    cardinal-closed - a closed Cardinal spline, as in a loop.
                    monotone - cubic interpolation that preserves monotonicity in y.
                - lineColor: (string) a valid HTML color, e.g., "steelblue", "rgb(227, 20, 6)", etc.
                - backgrounColor: (string) a valid HTML color, e.g., "steelblue", "rgb(227, 20, 6)", etc.
     *
     * @memberof module:Navigator
     * @instance
     */
    function Navigator(id, coords, opt) {
        opt = opt || {};
        coords = coords || {};

        this.colorIndex = 0;
        this.id = property.call(this, id);
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 200;
        this.height = coords.height || 80;
        this.default = {
            maxX: 100,
            maxY: 100
        };

        this.maxX = opt.maxX || this.default.maxX;
        this.maxY = opt.maxY || this.default.maxY;
        this.autoscale = opt.autoscale || true;
        this.scaleX = this.width / ( this.maxX);
        this.scaleY = this.height / ( this.maxY);

        this.lineColor = opt.lineColor || colors[this.colorIndex];
        this.arrowColor = opt.arrowColor || this.lineColor;

        this.align = opt.align || "center";
        this.backgroundColor = opt.backgroundColor || "whitesmoke";
        this.fontColor = opt.fontColor || "white";
        this.cursor = opt.cursor || "default";
        if (opt.inverted) {
            var tmp = this.backgroundColor;
            this.backgroundColor = this.fontColor;
            this.fontColor = tmp;
        }
        var elemClass = id + " navigator-widget" + " noselect ";

        opt.position = opt.position || "absolute";
        this.div = d3.select(this.parent)
                        .append("div").style("position", opt.position)
                        .style("top", this.top + "px").style("left", this.left + "px")
                        .style("width", this.width + "px").style("height", this.height + "px")
                        .style("margin", 0).style("padding", 0).style("opacity", 0.94)
                        .style("border-radius", "4px")
                        // .style("border-color", "gray").style("border-width", "10px").style("border-style", "solid")
                        .style("background-color", this.backgroundColor)
                        .style("display", "none").attr("id", id).attr("class", elemClass);

        var svg = this.div.append("svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg")
                        .attr("id", id + "_svg").attr("class", id + "_svg")
                        .attr("width", this.width).attr("height", this.height);
        var markerSize = 20;
        this.defs = svg.append("svg:defs");

        // this.filters = this.defs.append("filter").attr("id", "f2")
        //             .attr("x", "0").attr("y", "0")
        //             .attr("width", "200%").attr("height", "200%");
        // this.filters.append("feOffset")
        //             .attr("result", "offOut")
        //             .attr("in", "SourceGraphic").attr("dx", "20").attr("dy", "20");
        // this.filters.append("feGaussianBlur")
        //             .attr("result", "blurOut").attr("in", "offOut").attr("stdDeviation", "10");
        // this.filters.append("feBlend")
        //             .attr("in", "SourceGraphic").attr("in2", "blurOut").attr("mode", "normal");
        this.defs.append("svg:marker")
                    .attr("id", "end-arrow")
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 5)
                    .attr("refY", 0)
                    .attr("markerWidth", markerSize)
                    .attr("markerHeight", markerSize)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M5,-2 L5,2 M3,0 L7,0 ")
                    .attr("stroke", "Black")
                    .attr("stroke-width",0.5)
                    .attr("fill", "Black");
        this.defs.append("svg:marker")
                    .attr("id", "start-arrow")
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 5)
                    .attr("refY", 0)
                    .attr("markerWidth", markerSize)
                    .attr("markerHeight", markerSize)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M4,1 L4,-1 L6,-1 L6,1 L4,1 ")
                    .attr("fill", "Red");
                    

        opt.x0 = (isNaN(parseFloat(opt.x0)))? 0 : parseFloat(opt.x0);
        opt.y0 = (isNaN(parseFloat(opt.y0)))? 0 : parseFloat(opt.y0);
        this.data = [];

        opt.interpolation = opt.interpolation || "basis";
        this.line_function = d3.svg.line()
                                 .x(function(d) { return d.x; })
                                 .y(function(d) { return d.y; })
                                 .interpolate(opt.interpolation);

        this.path = svg.append("path")
                        .attr("d", this.line_function(this.data))
                        .attr("stroke", this.lineColor)
                        .attr("stroke-width", "4")
                        .attr("fill", "none");
        this.path.style("marker-end","url(#end-arrow)");
        this.path.style("marker-start","url(#start-arrow)");

        this.example = opt.example || [ { x:0, y:50 }, { x:100, y:50 }, { x:200, y:40 }, { x:300, y:60 }, { x:400, y:30 } ]; // example is used in the prototype builder to demonstrate the widget
        Widget.call(this, id, "navigator");
        return this;
    }
    Navigator.prototype = Object.create(Widget.prototype);
    Navigator.prototype.constructor = Navigator;
    Navigator.prototype.parentClass = Widget.prototype;

    /**
     * @function <a name="render">render</a>
     * @description Render method.
     * @param data {Array} Array of objects { x: float, y: float } indicating the navigation route.
     *                     The last element in the array is the current position of the vehicle.
     *                     The vehicle is initially positioned at the center of the display.
     *                     Negative x coordinates move the vehicle to the left.
     *                     Positive x coordinates move the vehicle to the right.
     *                     Negative y coordinates move the vehicle backwards.
     *                     Positive y coordinates move the vehicle forward.
     * @memberof module:Navigator
     * @instance
     */
    Navigator.prototype.render = function (data, opt) {
        function getRouteData (_this, data) {
            function pos_change() {
                return data.length === 1 &&
                        !(data[0].x === _this.data[_this.data.length - 1].x &&
                            data[0].y === _this.data[_this.data.length - 1].y);
            }
            if (data) {
                if (data.length > 1 || !_this.data.length || pos_change()) {
                    // route data is an array of objects { x: float, y: float }, e.g., [ { x:0, y:50 }, { x:100, y:80 }, { x:200, y:40 }, { x:300, y:60 }, { x:400, y:30 } ];
                    // if (_this.autoscale) {
                    //     var maxX = Math.max.apply( Math, data.map(function(d){ return d.x; }) );
                    //     maxX = (maxX > 10)? (1.1 * maxX) : 10;
                    //     // var minX = Math.min.apply( Math, data.map(function(d){ return d.x; }) );
                    //     var maxY = Math.max.apply( Math, data.map(function(d){ return d.y; }) );
                    //     maxY = (maxY > 10)? (1.1 * maxY) : 10;
                    //     // var minY = Math.min.apply( Math, data.map(function(d){ return d.y; }) );
                    //     _this.maxX = maxX || _this.default.maxX;
                    //     _this.maxY = maxY || _this.default.maxY;
                    //     _this.scaleX = _this.width / _this.maxX;
                    //     _this.scaleY = _this.height / _this.maxY;
                    // }
                    return _this.data.concat(data);
                }
            }
            return _this.data;
        };
        opt = opt || {};
        if (data) {
            var _this = this;
            this.data = getRouteData(_this, data);
            var plot_data = this.data.map(function (d) {
                return { x: Math.abs((d.x) * _this.scaleX), y: Math.abs((_this.maxY- d.y) * _this.scaleY) }; // we want to have (0,0) in bottom left corner -- with svg, (0,0) is the top left corner, so we need to flip the Y axis
            });
            this.path.attr("d", this.line_function(plot_data));
        }
        return this.reveal();
    };
    Navigator.prototype.resetDisplay = function (opt) {
        opt = opt || {};
        // reset data
        this.data = [];
        // set colors
        this.lineColor = opt.lineColor || this.lineColor;
        this.backgroundColor = opt.backgroundColor || this.backgroundColor;
        this.arrowColor = opt.arrowColor || this.lineColor;
        // remove the arrow from the old trace
        this.path.style("marker-end",null);
        // then append the new trace, and reuse the current trace if the path is empty
        if (this.path.attr("d")) {
            if (!opt.keepOldTrace) {
                this.path.node().remove();
            }
            if (opt.changeColor) {
                this.colorIndex = (this.colorIndex + 1) % maxC;
                this.lineColor = colors[this.colorIndex];
                this.arrowColor = opt.arrowColor || this.lineColor;
            }
            this.path = d3.select(this.path.node().parentNode)
                            .append("path")
        }
        this.path.attr("d", this.line_function(this.data))
                .attr("stroke", this.lineColor)
                .attr("stroke-width", "2")
                .attr("fill", "none");
        this.defs.select("path").attr("fill", this.arrowColor);
        this.path.style("marker-end","url(#end-arrow)");
    }
    Navigator.prototype.renderSample = function (opt) {
        opt = opt || {};
        return this.render(this.example);
    };

    Navigator.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    Navigator.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    Navigator.prototype.move = function (pos) {
        pos = pos || {};
        if (pos.top) {
            this.top = pos.top;
            this.div.style("top", this.top + "px");
        }
        if (pos.left) {
            this.left = pos.left;
            this.div.style("left", this.left + "px");
        }
        return this;
    };

    module.exports = Navigator;
});
