/**
 * Painless string scanning.
 * 
 * See https://github.com/typst/unscanny.
 */

import { pattern, Pattern } from './pattern';
export { pattern, Pattern };

import {
    Char,
    decode,
    encode,
    getChars,
    getCharsReverse,
    isCharBoundary,
    decodeIf,
    decodeOptionIf
} from './utf8';

export {
    Char,
    decode,
    encode,
    getChars,
    getCharsReverse,
    isCharBoundary,
    decodeIf,
    decodeOptionIf
};

import { None, Some, Option } from './option';
export { None, Some, Option };

/**
 * A string scanner.
 */
export class Scanner {
    /**
     * The string to scan, encoded as a UTF-8 array of bytes.
     */
    readonly bytes: Uint8Array;

    /**
     * The string to scan.
     */
    readonly string: string;

    /**
     * The index at which we currently are. It must always hold that:
     * - 0 <= cursor <= str.len()
     * - cursor is on a character boundary
     */
    cursor: number;

    /**
     * Create a new string scanner, starting with a cursor position of `0`.
     */
    constructor(string: string) {
        this.string = string;
        this.bytes = encode(string);
        this.cursor = 0;
    }

    /**
     * Whether the scanner has fully consumed the string.
     */
    done(): boolean {
        return this.cursor === this.bytes.length;
    }

    /**
     * The subslice before the cursor.
     */
    before(encoded?: false): string;
    before(encoded: true): Uint8Array;
    before(encoded?: boolean): string | Uint8Array;
    before(encoded?: boolean): string | Uint8Array {
        // The cursor is always in-bounds and on a codepoint boundary.
        return decodeIf(!encoded, this.bytes.slice(0, this.cursor));
    }

    /**
     * The subslice after the cursor.
     */
    after(encoded?: false): string;
    after(encoded: true): Uint8Array;
    after(encoded?: boolean): string | Uint8Array;
    after(encoded?: boolean): string | Uint8Array {
        // The cursor is always in-bounds and on a codepoint boundary.
        return decodeIf(!encoded, this.bytes.slice(this.cursor));
    }

    /**
     * The subslices before and after the cursor.
     */
    parts(encoded?: false): [string, string];
    parts(encoded: true): [Uint8Array, Uint8Array];
    parts(encoded?: boolean): [string, string] | [Uint8Array, Uint8Array];
    parts(encoded?: boolean): [string, string] | [Uint8Array, Uint8Array] {
        return encoded
            ? [this.before(encoded), this.after(encoded)]
            : [this.before(), this.after()];
    }

    /**
     * The subslice from `start` to the cursor.
     * 
     * Snaps `start` into the bounds of the string and to the next character
     * boundary.
     */
    from(start: number, encoded?: false): string;
    from(start: number, encoded: true): Uint8Array;
    from(start: number, encoded?: boolean): string | Uint8Array;
    from(start: number, encoded?: boolean): string | Uint8Array {
        // - Snapping returns an in-bounds index that is on a codepoint boundary
        // - The cursor is always in-bounds and on a codepoint boundary.
        // - The start index is <= the end index due to the `Math.min()`
        start = Math.min(this.cursor, this.snap(start));
        return decodeIf(!encoded, this.bytes.slice(start, this.cursor));
    }

    /**
     * The subslice from the cursor to `end`.
     * 
     * Snaps `end` into the bounds of the string and to the next character
     * boundary.
     */
    to(end: number, encoded?: false): string;
    to(end: number, encoded: true): Uint8Array;
    to(end: number, encoded?: boolean): string | Uint8Array;
    to(end: number, encoded?: boolean): string | Uint8Array {
        // - Snapping returns an in-bounds index that is on a codepoint boundary
        // - The cursor is always in-bounds and on a codepoint boundary.
        // - The end index is >= the start index due to the `Math.max()`
        end = Math.max(this.cursor, this.snap(end));
        return decodeIf(!encoded, this.bytes.slice(this.cursor, end));
    }

    /**
     * The subslice from the `start` to `end`.
     * 
     * Snaps `start` and `end` into the bounds of the string and to the next character
     * boundary.
     */
    get([rangeStart, rangeEnd]: [number, number], encoded?: false): string;
    get([rangeStart, rangeEnd]: [number, number], encoded: true): Uint8Array;
    get([rangeStart, rangeEnd]: [number, number], encoded?: boolean): string | Uint8Array;
    get([rangeStart, rangeEnd]: [number, number], encoded?: boolean): string | Uint8Array {
        // - Snapping returns an in-bounds index that is on a code point boundary
        // - The end index is >= the start index due to the `Math.max()`
        const start = this.snap(rangeStart);
        const end = Math.max(this.snap(rangeEnd), start);
        return decodeIf(!encoded, this.bytes.slice(start, end));
    }

    /**
     * The character right behind the cursor.
     */
    peek(encoded?: false): Option<string>;
    peek(encoded: true): Option<Uint8Array>;
    peek(encoded?: boolean): Option<string> | Option<Uint8Array>;
    peek(encoded?: boolean): Option<string> | Option<Uint8Array> {
        const char = getChars(this.after(true)).next().value;
        if (char === None) return None;
        return decodeIf(!encoded, char);
    }

    /**
     * Whether the part right behind the cursor starts with the given pattern.
     * 
     * @example
     *
     * ```js
     * scanner.at('A')
     * scanner.at(['A'])
     * scanner.at(/^A$/.test) // Don't forget to match the boundaries of the string using `^` and `$`!
     * scanner.at((string: string) => string.startsWith('A'))
     * ```
     */
    at(pattern: pattern): boolean {
        return Pattern.from(pattern).matches(this.after(true)) !== None;
    }

    /**
     * Look at the n-th character relative to the cursor without changing the
     * cursor.
     *
     * - `scout(-1)` is the character before the cursor.
     * - `scout(0)` is the same as `peek()`.
     */
    scout(n: number, encoded?: false): Option<string>;
    scout(n: number, encoded: true): Option<Uint8Array>;
    scout(n: number, encoded?: boolean): Option<string> | Option<Uint8Array>;
    scout(n: number, encoded?: boolean): Option<string> | Option<Uint8Array> {
        if (n >= 0) {
            return decodeOptionIf(!encoded, getChars(this.after(true), n).next().value);
        } else {
            return decodeOptionIf(!encoded, getCharsReverse(this.before(true), -n - 1).next().value);
        }
    }

    /**
     * The byte index of the n-th character relative to the cursor.
     * 
     * - `locate(-1)` is the byte position of the character before the cursor.
     * - `locate(0)` is the same as `cursor()`.
     * 
     * Runs in `O(|n|)`.
     */
    locate(n: number): number {
        if (n >= 0) {
            const chars = getChars(this.after(true));
            let pos = 0;
            for (let i = 0; i < n; i++) {
                pos += chars.next().value?.length ?? 0;
            }
            return this.cursor + pos;
        } else {
            const chars = getCharsReverse(this.before(true));
            let pos = 0;
            for (let i = 0; i > n; i--) {
                pos += chars.next().value?.length ?? 0;
            }
            return this.cursor - pos;
        }
    }

    /**
     * Consume and return the character right behind the cursor.
     */
    eat(encoded?: false): Option<string>;
    eat(encoded: true): Option<Uint8Array>;
    eat(encoded?: boolean): Option<string> | Option<Uint8Array>;
    eat(encoded?: boolean): Option<string> | Option<Uint8Array> {
        const peeked = this.peek(true);
        if (peeked) {
            this.cursor += peeked.length;
        }
        return decodeOptionIf(!encoded, peeked);
    }

    /**
     * Consume and return the character right before the cursor, moving it back.
     */
    uneat(encoded?: false): Option<string>;
    uneat(encoded: true): Option<Uint8Array>;
    uneat(encoded?: boolean): Option<string> | Option<Uint8Array>;
    uneat(encoded?: boolean): Option<string> | Option<Uint8Array> {
        const unpeeked = encode(this.scout(-1));
        if (unpeeked) {
            this.cursor -= unpeeked.length;
        }
        return decodeOptionIf(!encoded, unpeeked);
    }

    /**
     * Consume the given pattern if that's what's right behind the cursor.
     * 
     * Returns `true` if the pattern was consumed.
     */
    eatIf(pattern: pattern): boolean {
        const pat = Pattern.from(pattern);
        const len = pat.matches(this.after(true));
        if (len !== None) {
            this.cursor += len;
            return true;
        }
        return false;
    }

    /**
     * Consume while the given pattern is what's right behind the cursor.
     * 
     * Returns the consumed substring.
     */
    eatWhile(pattern: pattern, encoded?: false): string;
    eatWhile(pattern: pattern, encoded: true): Uint8Array;
    eatWhile(pattern: pattern, encoded?: boolean): string | Uint8Array;
    eatWhile(pattern: pattern, encoded?: boolean): string | Uint8Array {
        const pat = Pattern.from(pattern);
        const start = this.cursor;
        let len: ReturnType<Pattern['matches']>;
        while (!this.done() && ((len = pat.matches(this.after(true))) !== None)) {
            this.cursor += len;
        }
        return this.from(start, encoded);
    }

    /**
     * Consume until the given pattern is what's right behind the cursor.
     * 
     * Returns the consumed substring.
     */
    eatUntil(pattern: pattern, encoded?: false): string;
    eatUntil(pattern: pattern, encoded: true): Uint8Array;
    eatUntil(pattern: pattern, encoded?: boolean): string | Uint8Array;
    eatUntil(pattern: pattern, encoded?: boolean): string | Uint8Array {
        const pat = Pattern.from(pattern);
        const start = this.cursor;
        while (!this.done() && (pat.matches(this.after(true)) === None)) {
            this.eat();
        }
        return this.from(start, encoded);
    }

    /**
     * Consume all whitespace until the next non-whitespace character.
     * 
     * Returns the consumed whitespace.
     */
    eatWhitespace(encoded?: false): string;
    eatWhitespace(encoded: true): Uint8Array;
    eatWhitespace(encoded?: boolean): string | Uint8Array;
    eatWhitespace(encoded?: boolean): string | Uint8Array {
        return this.eatWhile(Char.isWhitespace, encoded);
    }

    /**
     * Consume the given pattern if that's what's right behind the cursor or
     * throws a ScanningError otherwise.
     */
    expect(pattern: pattern) {
        const pat = Pattern.from(pattern);
        const len = pat.matches(this.after(true));
        if (len) {
            this.cursor += len;
        } else {
            pat.expected();
        }
    }

    /**
     * Jump to a byte position in the source string.
     * 
     * Snaps into the bounds of the string and to the next character boundary.
     */
    jump(target: number) {
        // Snapping returns an in-bounds index that is on a codepoint
        // boundary.
        this.cursor = this.snap(target);
    }

    /**
     * Snaps an index in-bounds and to the next codepoint boundary.
     */
    snap(index: number): number {
        // - The calls to `Math.min()` and `Math.max()` bring the index in bounds
        // - After the while loop, the index must be on a codepoint boundary
        // - `index` cannot underflow because 0 is always a codepoint boundary
        index = Math.max(0, Math.min(index, this.bytes.length));
        while (!isCharBoundary(this.bytes[index])) {
            index--;
        }
        return index;
    }

    toString(): string {
        const [before, after] = [this.before(true), this.after(true)];
        let str = 'Scanner(';
        if (before.length > 0) {
            str += decode(before)
                .replaceAll('\n', '\\n')
                .replaceAll('\r', '\\r')
                .replaceAll('\v', '\\v')
                .replaceAll('\t', '\\t')
                .replaceAll('\b', '\\b')
                .replaceAll('\f', '\\f');
            str += ' ';
        }
        str += '|';
        if (after.length > 0) {
            str += ' ';
            str += decode(after)
                .replaceAll('\n', '\\n')
                .replaceAll('\r', '\\r')
                .replaceAll('\v', '\\v')
                .replaceAll('\t', '\\t')
                .replaceAll('\b', '\\b')
                .replaceAll('\f', '\\f');
        }
        str += ')';  
        return str;
    }
}