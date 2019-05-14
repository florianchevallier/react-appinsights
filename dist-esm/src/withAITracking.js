// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as tslib_1 from "tslib";
import * as React from "react";
import { reactAI } from "./ReactAI";
/**
 * Higher-order component function to hook Application Insights tracking
 * in a React component's lifecycle.
 *
 * @param Component the component to be instrumented with Application Insights tracking
 * @param componentName (optional) component name
 */
export default function withAITracking(Component, componentName) {
    if (componentName === undefined || componentName === null || typeof componentName !== 'string') {
        componentName = Component.prototype.constructor.name;
    }
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mountTimestamp = 0;
            _this.firstActiveTimestamp = 0;
            _this.idleStartTimestamp = 0;
            _this.lastActiveTimestamp = 0;
            _this.totalIdleTime = 0;
            _this.idleCount = 0;
            _this.idleTimeout = 5000;
            _this.trackActivity = function (e) {
                if (_this.firstActiveTimestamp === 0) {
                    _this.firstActiveTimestamp = Date.now();
                    _this.lastActiveTimestamp = _this.firstActiveTimestamp;
                }
                else {
                    _this.lastActiveTimestamp = Date.now();
                }
                if (_this.idleStartTimestamp > 0) {
                    var lastIdleTime = _this.lastActiveTimestamp - _this.idleStartTimestamp;
                    _this.totalIdleTime += lastIdleTime;
                    _this.debugLog("trackActivity", "Idle to active added " + lastIdleTime / 1000 + " seconds of idle time.");
                    _this.idleStartTimestamp = 0;
                }
            };
            return _this;
        }
        class_1.prototype.componentDidMount = function () {
            var _this = this;
            this.mountTimestamp = Date.now();
            this.firstActiveTimestamp = 0;
            this.totalIdleTime = 0;
            this.lastActiveTimestamp = 0;
            this.idleStartTimestamp = 0;
            this.idleCount = 0;
            this.intervalId = setInterval(function () {
                if (_this.lastActiveTimestamp > 0 && _this.idleStartTimestamp === 0 && Date.now() - _this.lastActiveTimestamp >= _this.idleTimeout) {
                    _this.idleStartTimestamp = Date.now();
                    _this.idleCount++;
                    _this.debugLog("componentDidMount", "Starting idle time.");
                }
            }, 100);
        };
        class_1.prototype.componentWillUnmount = function () {
            if (this.mountTimestamp === 0) {
                throw new Error("withAITracking:componentWillUnmount: mountTimestamp isn't initialized.");
            }
            if (!reactAI.appInsights) {
                throw new Error("withAITracking:componentWillUnmount: ReactAI isn't initialized.");
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            if (this.firstActiveTimestamp === 0) {
                this.debugLog("componentWillUnmount", "Nothing to track.");
                return;
            }
            var engagementTime = this.getEngagementTimeSeconds();
            var metricData = {
                average: engagementTime,
                name: "React Component Engaged Time (seconds)",
                sampleCount: 1
            };
            var additionalProperties = { "Component Name": componentName };
            this.debugLog("componentWillUnmount", "Tracking " + engagementTime + " seconds of engagement time for " + componentName + ".");
            reactAI.appInsights.trackMetric(metricData, additionalProperties);
        };
        class_1.prototype.render = function () {
            return (React.createElement("div", { onKeyDown: this.trackActivity, onMouseMove: this.trackActivity, onScroll: this.trackActivity, onMouseDown: this.trackActivity, onTouchStart: this.trackActivity, onTouchMove: this.trackActivity, className: "appinsights-hoc" },
                React.createElement(Component, tslib_1.__assign({}, this.props))));
        };
        class_1.prototype.debugLog = function (from, message) {
            if (reactAI.isDebugMode) {
                console.log("withAITracking:" + componentName + ":" + from + ": " + message, {
                    engagementTime: this.getEngagementTimeSeconds(),
                    firstActiveTime: this.firstActiveTimestamp,
                    idleStartTime: this.idleStartTimestamp,
                    idleTimeMs: this.totalIdleTime,
                    lastActiveTime: this.lastActiveTimestamp,
                    mountTimestamp: this.mountTimestamp
                });
            }
        };
        class_1.prototype.getEngagementTimeSeconds = function () {
            return (Date.now() - this.firstActiveTimestamp - this.totalIdleTime - this.idleCount * this.idleTimeout) / 1000;
        };
        return class_1;
    }(React.Component));
}
//# sourceMappingURL=withAITracking.js.map