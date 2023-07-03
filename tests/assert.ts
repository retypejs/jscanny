import { expect, assert } from 'chai';
export { expect };

export function assertEq(left: any, right: any, message: string) {
    it(message, () => assert.strictEqual(left, right));
}

export function assertDeepEq(left: any, right: any, message: string) {
    it(message, () => assert.deepEqual(left, right));
}