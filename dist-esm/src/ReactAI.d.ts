import { IPlugin } from "@microsoft/applicationinsights-core-js";
import { ApplicationInsights as AppInsightsPlugin, IAppInsightsCore, IConfig, IConfiguration, IPageViewTelemetry, ITelemetryItem, ITelemetryPlugin } from "@microsoft/applicationinsights-web";
import IReactAISettings from "./IReactAISettings";
/**
 * Module to include Microsoft Application Insights in React applications.
 *
 * @export
 * @class ReactAI
 */
declare class ReactAI implements ITelemetryPlugin {
    extensionId: string;
    ApplicationInsightsAnalyticsIdentifier: string;
    processTelemetry: (env: ITelemetryItem) => void;
    identifier: string;
    priority: number;
    appInsights: AppInsightsPlugin;
    private propertiesPlugin;
    private nextPlugin;
    private contextProps;
    private debug;
    constructor();
    setNextPlugin(plugin: ITelemetryPlugin): void;
    /**
     * Returns the current value of context/custom dimensions.
     *
     * @readonly
     * @type {{ [key: string]: any }}
     * @memberof ReactAI
     */
    readonly context: {
        [key: string]: any;
    };
    /**
     * Returns if ReactAI is in debug mode.
     *
     * @readonly
     * @type {boolean}
     * @memberof ReactAI
     */
    readonly isDebugMode: boolean;
    /**
     * Initializes a singleton instance of ReactAI based on supplied parameters.
     *
     * @param {IReactAISettings} settings
     * @memberof ReactAI
     */
    initialize(settings: IReactAISettings & IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[]): void;
    _trackInitialPageViewInternal(telemetry: IPageViewTelemetry): void;
    /**
     * Set custom context/custom dimensions for Application Insights
     *
     * @param {{ [key: string]: any }} properties - custom properties to add to all outbound Application Insights telemetry
     * @param {boolean} [clearPrevious=false] - if false(default) multiple calls to setContext will append to/overwrite existing custom dimensions, if true the values are reset
     * @memberof ReactAI
     */
    setContext(properties: {
        [key: string]: any;
    }, clearPrevious?: boolean): void;
    private customDimensionsInitializer;
    private addHistoryListener;
    private debugLog;
}
export declare const reactAI: ReactAI;
export {};
//# sourceMappingURL=ReactAI.d.ts.map