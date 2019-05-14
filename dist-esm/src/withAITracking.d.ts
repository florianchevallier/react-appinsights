import * as React from "react";
/**
 * Higher-order component function to hook Application Insights tracking
 * in a React component's lifecycle.
 *
 * @param Component the component to be instrumented with Application Insights tracking
 * @param componentName (optional) component name
 */
export default function withAITracking<P>(Component: React.ComponentType<P>, componentName?: string): React.ComponentClass<P>;
//# sourceMappingURL=withAITracking.d.ts.map