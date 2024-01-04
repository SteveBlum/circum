import JSDOMEnvironment from "jest-environment-jsdom";

/**
 * Fix for jest to properly support the global function structuredClone()
 * References:
 * https://github.com/facebook/jest/blob/v29.4.3/website/versioned_docs/version-29.4/Configuration.md#testenvironment-string
 * https://github.com/jsdom/jsdom/issues/3363
 */
export default class FixJSDOMEnvironment extends JSDOMEnvironment {
    // eslint-disable-next-line jsdoc/require-jsdoc
    constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...args);
        this.global.structuredClone = structuredClone;
    }
}
