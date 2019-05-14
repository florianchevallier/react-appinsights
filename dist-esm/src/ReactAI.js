// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PropertiesPluginIdentifier } from "@microsoft/applicationinsights-common";
/**
 * Module to include Microsoft Application Insights in React applications.
 *
 * @export
 * @class ReactAI
 */
var ReactAI = /** @class */ (function () {
    function ReactAI() {
        this.extensionId = "ApplicationInsightsReactUsage";
        this.ApplicationInsightsAnalyticsIdentifier = "ApplicationInsightsAnalytics";
        this.identifier = this.extensionId;
        this.priority = 190;
        this.contextProps = {};
        this.debug = false;
        this.processTelemetry = this.customDimensionsInitializer.bind(this);
    }
    ReactAI.prototype.setNextPlugin = function (plugin) {
        this.nextPlugin = plugin;
    };
    Object.defineProperty(ReactAI.prototype, "context", {
        /**
         * Returns the current value of context/custom dimensions.
         *
         * @readonly
         * @type {{ [key: string]: any }}
         * @memberof ReactAI
         */
        get: function () {
            return this.contextProps || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactAI.prototype, "isDebugMode", {
        /**
         * Returns if ReactAI is in debug mode.
         *
         * @readonly
         * @type {boolean}
         * @memberof ReactAI
         */
        get: function () {
            return this.debug;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initializes a singleton instance of ReactAI based on supplied parameters.
     *
     * @param {IReactAISettings} settings
     * @memberof ReactAI
     */
    ReactAI.prototype.initialize = function (settings, core, extensions) {
        var _this = this;
        var reactAISettings = settings.extensionConfig && settings.extensionConfig[this.identifier]
            ? settings.extensionConfig[this.identifier]
            : { debug: false };
        this.debug = reactAISettings.debug || false;
        this.setContext(reactAISettings.initialContext || {}, true);
        extensions.forEach(function (ext) {
            var identifier = ext.identifier;
            if (identifier === _this.ApplicationInsightsAnalyticsIdentifier) {
                _this.appInsights = ext;
            }
            if (identifier === PropertiesPluginIdentifier) {
                _this.propertiesPlugin = ext;
            }
        });
        if (reactAISettings.history) {
            this.addHistoryListener(reactAISettings.history);
            var pageViewTelemetry = {
                uri: reactAISettings.history.location.pathname,
                properties: this.context
            };
            this._trackInitialPageViewInternal(pageViewTelemetry);
        }
    };
    // internal only, public method for testing
    ReactAI.prototype._trackInitialPageViewInternal = function (telemetry) {
        // Record initial page view, since history.listen is not fired for the initial page
        // (see: https://github.com/ReactTraining/history/issues/479#issuecomment-307544999 )
        this.appInsights.trackPageView(telemetry);
        this.debugLog("recording initial page view.", "uri: " + location.pathname);
    };
    /**
     * Set custom context/custom dimensions for Application Insights
     *
     * @param {{ [key: string]: any }} properties - custom properties to add to all outbound Application Insights telemetry
     * @param {boolean} [clearPrevious=false] - if false(default) multiple calls to setContext will append to/overwrite existing custom dimensions, if true the values are reset
     * @memberof ReactAI
     */
    ReactAI.prototype.setContext = function (properties, clearPrevious) {
        if (clearPrevious === void 0) { clearPrevious = false; }
        if (clearPrevious) {
            this.contextProps = {};
            this.debugLog("context is reset.");
        }
        properties = properties || {};
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                this.contextProps[key] = properties[key];
            }
        }
        this.debugLog("context is set to:", this.context);
    };
    ReactAI.prototype.customDimensionsInitializer = function (envelope) {
        envelope.baseData = envelope.baseData || {};
        envelope.baseData.properties = envelope.baseData.properties || {};
        var properties = envelope.baseData.properties;
        var props = this.context;
        for (var key in props) {
            if (props.hasOwnProperty(key)) {
                properties[key] = props[key];
            }
        }
        if (this.nextPlugin != null) {
            this.nextPlugin.processTelemetry(envelope);
        }
    };
    ReactAI.prototype.addHistoryListener = function (history) {
        var _this = this;
        history.listen(function (location, action) {
            // Timeout to ensure any changes to the DOM made by route changes get included in pageView telemetry
            setTimeout(function () {
                var pageViewTelemetry = { uri: location.pathname, properties: _this.context };
                _this.appInsights.trackPageView(pageViewTelemetry);
                _this.debugLog("recording page view.", "uri: " + location.pathname + " action: " + action);
            }, 500);
        });
    };
    ReactAI.prototype.debugLog = function (message, payload) {
        if (this.isDebugMode) {
            console.log("ReactAI: " + message, payload === undefined ? "" : payload);
        }
    };
    return ReactAI;
}());
export var reactAI = new ReactAI();
//# sourceMappingURL=ReactAI.js.map