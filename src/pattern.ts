import { encode, decode, getChars } from "./utf8";

/**
 * Something a string can start with.
 */
export type pattern =
    | string
    | string[]
    | RegExp
    | ((string: string) => boolean);

/**
 * Something a string can start with.
 */
export abstract class Pattern {
    abstract pattern: pattern;
    abstract matches(string: Uint8Array): number | null;
    abstract expected(): never;

    static from(pattern: pattern): Pattern {
        if (pattern instanceof RegExp) return new RegExpPattern(pattern);
        if (typeof pattern === 'function') return new FunctionPattern(pattern);
        if (typeof pattern === 'string') return new StringPattern(pattern);
        return new StringArrayPattern(pattern);
    }
}

class StringPattern extends Pattern {
    pattern: string;

    constructor(pattern: string) {
        super();
        this.pattern = pattern;
    }

    matches(string: Uint8Array): number | null {
        return decode(string).startsWith(this.pattern)
            ? encode(this.pattern).length
            : null;
    }

    expected(): never {
        throw new ScanningError(`expected '${this.pattern}'`);
    }
}

class StringArrayPattern extends Pattern {
    pattern: string[];

    constructor(pattern: string[]) {
        super();
        this.pattern = pattern;
    }

    matches(string: Uint8Array): number | null {
        for (const searchString of this.pattern) {
            if (decode(string)?.startsWith(searchString)) {
                return encode(searchString).length;
            }
        }
        return null;
    }

    expected(): never {
        if (this.pattern.length === 0) {
            throw new ScanningError(`empty slice cannot match`);
        }
        throw new ScanningError(`expected ${this.pattern.join(' or ')}`);
    }
}

class RegExpPattern extends Pattern {
    pattern: RegExp;

    constructor(pattern: RegExp) {
        if (!pattern.source.startsWith('^')) {
            throw new PatternError(`${pattern} does not match the start of a string using \`^\``);
        }
        super();
        this.pattern = pattern;
    }

    matches(string: Uint8Array): number | null {
        const char = getChars(string).next().value;
        if (char === null) {
            return null;
        }
        return this.pattern.test(decode(char)) ? char.length : null;
    }

    expected(): never {
        throw new ScanningError(`expected ${this.pattern}`);
    }
}

class FunctionPattern extends Pattern {
    pattern: (string: string) => boolean;

    constructor(pattern: (string: string) => boolean) {
        super();
        this.pattern = pattern;
    }

    matches(string: Uint8Array): number | null {
        const char = getChars(string).next().value;
        if (char === null) {
            return null;
        }
        return this.pattern(decode(char)) ? char.length : null;
    }

    expected(): never {
        throw new ScanningError(`expected closure to return \`true\``);
    }
}

export class ScanningError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScanningError';
    }
}

export class PatternError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PatternError';
    }
}