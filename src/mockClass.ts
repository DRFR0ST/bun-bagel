import { MockOptions } from "./types";
import { MOCKED_REQUESTS } from "./mock";

/**
 * A class that represents a mocked request.
 * @param key - The key of the mocked request, an instance of RegExp.
 * @param options - The options for the mocked request.
 */
export class Mock {
    public calledTimes: number = 0;

    constructor(public key: RegExp, public options: MockOptions) {
    }

    /**
     * Clear the mocked request.
     */
    public clear() {
        MOCKED_REQUESTS.delete(this.key);
    }

    /**
     * Check if the mocked request has been called.
     */
    public get called() {
        return !!this.calledTimes;
    }

    /**
     * Increment the number of times the mocked request has been called.
     * It's used internally. Call only, if you know what you're doing.
     */
    public _incrementCalled() {
        this.calledTimes++;
    }
}
