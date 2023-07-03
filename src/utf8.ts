import { None, Some, Option } from "./option";

/**
 * A single Unicode code point.
 */
export class Char {
    /**
     * Checks if the given string is a single Unicode alphabetic character.
     */
    static isAlphabetic(string: Uint8Array): boolean;
    static isAlphabetic(string: string): boolean;
    static isAlphabetic(string: string | Uint8Array): boolean;
    static isAlphabetic(string: string | Uint8Array): boolean {
        return /^\p{Alphabetic}$/u.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single Unicode alphabetic or numeric
     * character.
     */
    static isAlphanumeric(string: Uint8Array): boolean;
    static isAlphanumeric(string: string): boolean;
    static isAlphanumeric(string: string | Uint8Array): boolean;
    static isAlphanumeric(string: string | Uint8Array): boolean {
        return Char.isAlphabetic(string) || Char.isNumeric(string);
    }

    /**
     * Checks if the given string is a single ASCII character
     * - U+0000 `NUL` to U+007F `DELETE`
     */
    static isAscii(string: Uint8Array): boolean;
    static isAscii(string: string): boolean;
    static isAscii(string: string | Uint8Array): boolean;
    static isAscii(string: string | Uint8Array): boolean {
        return /^[\x00-\x7F]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII alphabetic character
     * - U+0041 `A` to U+005A `Z`
     * - U+0061 `a` to U+007A `z`
     */
    static isAsciiAlphabetic(string: Uint8Array): boolean;
    static isAsciiAlphabetic(string: string): boolean;
    static isAsciiAlphabetic(string: string | Uint8Array): boolean;
    static isAsciiAlphabetic(string: string | Uint8Array): boolean {
        return /^[a-zA-Z]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII alphanumeric character
     * - U+0030 `0` to U+0039 `9`
     * - U+0041 `A` to U+005A `Z`
     * - U+0061 `a` to U+007A `z`
     */
    static isAsciiAlphanumeric(string: Uint8Array): boolean;
    static isAsciiAlphanumeric(string: string): boolean;
    static isAsciiAlphanumeric(string: string | Uint8Array): boolean;
    static isAsciiAlphanumeric(string: string | Uint8Array): boolean {
        return /^[0-9a-zA-Z]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII control character
     * - U+0000 `NUL` to U+001F `UNIT SEPARATOR`
     * - U+007F `DELETE`
     */
    static isAsciiControl(string: Uint8Array): boolean;
    static isAsciiControl(string: string): boolean;
    static isAsciiControl(string: string | Uint8Array): boolean;
    static isAsciiControl(string: string | Uint8Array): boolean {
        return /^[\x00-\x1F\x7F]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII digit
     * - U+0030 `0` to U+0039 `9`
     */
    static isAsciiDigit(string: Uint8Array): boolean;
    static isAsciiDigit(string: string): boolean;
    static isAsciiDigit(string: string | Uint8Array): boolean;
    static isAsciiDigit(string: string | Uint8Array): boolean {
        return /^[0-9]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII graphic character
     * - U+0021 `!` to U+007E `~`
     */
    static isAsciiGraphic(string: Uint8Array): boolean;
    static isAsciiGraphic(string: string): boolean;
    static isAsciiGraphic(string: string | Uint8Array): boolean;
    static isAsciiGraphic(string: string | Uint8Array): boolean {
        return /^[\x21-\x7E]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII hexadecimal digit
     * - U+0030 `0` to U+0039 `9`
     * - U+0041 `A` to U+0046 `F`
     * - U+0061 `a` to U+0066 `f`
     */
    static isAsciiHexDigit(string: Uint8Array): boolean;
    static isAsciiHexDigit(string: string): boolean;
    static isAsciiHexDigit(string: string | Uint8Array): boolean;
    static isAsciiHexDigit(string: string | Uint8Array): boolean {
        return /^[0-9A-Fa-f]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII lowercase character
     * - U+0061 `a` to U+007A `z`
     */
    static isAsciiLowercase(string: Uint8Array): boolean;
    static isAsciiLowercase(string: string): boolean;
    static isAsciiLowercase(string: string | Uint8Array): boolean;
    static isAsciiLowercase(string: string | Uint8Array): boolean {
        return /^[a-z]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII octal digit
     * - U+0030 `0` to U+0037 `7`
     */
    static isAsciiOctDigit(string: Uint8Array): boolean;
    static isAsciiOctDigit(string: string): boolean;
    static isAsciiOctDigit(string: string | Uint8Array): boolean;
    static isAsciiOctDigit(string: string | Uint8Array): boolean {
        return /^[0-7]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII punctuation character
     * - U+0021 to U+002F `!` `"` `#` `$` `%` `&` `'` `(` `)` `*` `+` `,` `-`
     *   `.` `/`
     * - U+003A to U+0040 `:` `;` `<` `=` `>` `?` `@`
     * - U+005B to U+0060 `[` `\` `]` `^` `_` `` ` ``
     * - U+007B to U+007E `{` `|` `}` `~`
     */
    static isAsciiPunctuation(string: Uint8Array): boolean;
    static isAsciiPunctuation(string: string): boolean;
    static isAsciiPunctuation(string: string | Uint8Array): boolean;
    static isAsciiPunctuation(string: string | Uint8Array): boolean {
        return /^[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII uppercase character
     * - U+0041 `A` to U+005A `Z`
     */
    static isAsciiUppercase(string: Uint8Array): boolean;
    static isAsciiUppercase(string: string): boolean;
    static isAsciiUppercase(string: string | Uint8Array): boolean
    static isAsciiUppercase(string: string | Uint8Array): boolean {
        return /^[A-Z]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single ASCII whitespace character
     * - U+0009 `HORIZONTAL TAB`
     * - U+000A `LINE FEED`
     * - U+000C `FORM FEED`
     * - U+000D `CARRIAGE RETURN`
     * - U+0020 `SPACE`
     */
    static isAsciiWhitespace(string: Uint8Array): boolean;
    static isAsciiWhitespace(string: string): boolean;
    static isAsciiWhitespace(string: string | Uint8Array): boolean
    static isAsciiWhitespace(string: string | Uint8Array): boolean {
        return /^[\x09\x0A\x0C\x0D\x20]$/.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single Unicode control character.
     */
    static isControl(string: Uint8Array): boolean;
    static isControl(string: string): boolean;
    static isControl(string: string | Uint8Array): boolean;
    static isControl(string: string | Uint8Array): boolean {
        return /^\p{Cc}$/u.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a digit in the given radix (or base).
     * This function only recognizes the following characters:
     * - U+0030 `0` to U+0039 `9`
     * - U+0041 `A` to U+0046 `F`
     * - U+0061 `a` to U+0066 `f`
     */
    static isDigit(string: Uint8Array, radix: number): boolean;
    static isDigit(string: string, radix: number): boolean;
    static isDigit(string: string | Uint8Array, radix: number): boolean;
    static isDigit(string: string | Uint8Array, radix: number): boolean {
        if (string instanceof Uint8Array) {
            string = decode(string);
        }
        const codePoint = string.codePointAt(0);
        if (codePoint === undefined || radix < 2 || radix > 36) {
            return false;
        }
        if (radix <= 10) {
            return (0x30 <= codePoint) && (codePoint < (0x30 + radix));
        }
        return (0x30 <= codePoint) && (codePoint < (0x30 + radix)) ||
            (0x41 <= codePoint) && (codePoint < (0x41 + radix-10)) ||
            (0x61 <= codePoint) && (codePoint < (0x41 + radix-10));
    }

    /**
     * Checks if the given string is a single Unicode lowercase character.
     */
    static isLowercase(string: Uint8Array): boolean;
    static isLowercase(string: string): boolean;
    static isLowercase(string: string | Uint8Array): boolean;
    static isLowercase(string: string | Uint8Array): boolean {
        return /^\p{Lowercase}$/u.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single Unicode numeric character.
     */
    static isNumeric(string: Uint8Array): boolean;
    static isNumeric(string: string): boolean;
    static isNumeric(string: string | Uint8Array): boolean;
    static isNumeric(string: string | Uint8Array): boolean {
        return /^\p{Number}$/u.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single Unicode uppercase character.
     */
    static isUppercase(string: Uint8Array): boolean;
    static isUppercase(string: string): boolean;
    static isUppercase(string: string | Uint8Array): boolean;
    static isUppercase(string: string | Uint8Array): boolean {
        return /^\p{Uppercase}$/u.test(
            string instanceof Uint8Array ? decode(string) : string
        );
    }

    /**
     * Checks if the given string is a single Unicode whitespace character.
     */
    static isWhitespace(string: Uint8Array): boolean;
    static isWhitespace(string: string): boolean;
    static isWhitespace(string: string | Uint8Array): boolean;
    static isWhitespace(string: string | Uint8Array): boolean {
        return /^[\s\u0009-\u000D\u0085\u1680\u2000-\u200A\u202F\u205F\u3000]$/u
            .test(string instanceof Uint8Array ? decode(string) : string);
    }
}

const textEncoder = new TextEncoder();

/**
 * Returns the given string encoded as an array of UTF-8 bytes.
 */
export function encode(string: string | undefined): Uint8Array;
export function encode(string: null): null;
export function encode(string: string | undefined | null): Uint8Array | null;
export function encode(string: string | undefined | null): Uint8Array | null {
    if (string === null) return null;
    return textEncoder.encode(string);
}

const textDecoder = new TextDecoder();

/**
 * Returns the given array of UTF-8 bytes decoded as a string.
 */
export function decode(bytes: Uint8Array | undefined): string;
export function decode(bytes: null): null;
export function decode(bytes: Uint8Array | undefined | null): string | null;
export function decode(bytes: Uint8Array | undefined | null): string | null {
    if (bytes === null) return null;
    return textDecoder.decode(bytes);
}

export function decodeIf(doDecode: boolean, string: Uint8Array): Uint8Array | string {
    return doDecode ? decode(string) : string;
}

export function decodeOptionIf(doDecode: boolean, string: Option<Uint8Array>): Option<Uint8Array> | Option<string> {
    if (string === None) return None;
    return doDecode ? decode(string) : string;
}

/**
 * Whether the given byte starts a Unicode code point.
 */
export function isCharBoundary(byte: number): boolean {
    return (byte & 0b11000000) !== 0b10000000;
}

/**
 * Returns an iterator over the Unicode code points in `string` starting from `index`.
 */
export function getChars(string: string, index?: number): Generator<Uint8Array, null>;
export function getChars(string: Uint8Array, index?: number): Generator<Uint8Array, null>;
export function* getChars(string: string | Uint8Array, index?: number): Generator<Uint8Array, null> {
    if (typeof string === 'string') {
        string = encode(string);
    }

    let start = 0;
    let end = 0;

    while (end < string.length) {
        if ((string[start] & 0b10000000) === 0b00000000) end = start;
        if ((string[start] & 0b11100000) === 0b11000000) end = start + 1;
        if ((string[start] & 0b11110000) === 0b11100000) end = start + 2;
        if ((string[start] & 0b11110000) === 0b11110000) end = start + 3;

        end++;

        // Skip the nth code point if n < index
        // Yield the nth code point otherwise
        if (index === undefined || index === 0) {
            yield string.slice(start, end);
        } else {
            index--;
        }

        start = end;
    }

    return null;
}

/**
 * Returns an iterator over the Unicode code points in the reversed `string` starting from `index`.
 */
export function getCharsReverse(string: string, index?: number): Generator<Uint8Array, null>;
export function getCharsReverse(string: Uint8Array, index?: number): Generator<Uint8Array, null>;
export function* getCharsReverse(string: string | Uint8Array, index?: number): Generator<Uint8Array, null> {
    if (typeof string === 'string') {
        string = encode(string);
    }

    let start = string.length - 1;
    let end = string.length;

    while (start >= 0) {
        while ((string[start] & 0b11000000) === 0b10000000) start--;

        if ((string[start] & 0b10000000) === 0b00000000) end = start;
        if ((string[start] & 0b11100000) === 0b11000000) end = start + 1;
        if ((string[start] & 0b11110000) === 0b11100000) end = start + 2;
        if ((string[start] & 0b11110000) === 0b11110000) end = start + 3;
        
        end++;

        // Skip the nth code point if index < n
        // Yield the nth code point otherwise
        if (index === undefined || index === 0) {
            yield string.slice(start, end);
        } else {
            index--;
        }

        end = start;
        start--;
    }

    return null;
}