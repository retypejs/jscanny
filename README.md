# jscanny

[![latest release](https://badgen.net/github/release/retypejs/jscanny?color=green)](https://github.com/retypejs/jscanny/releases) [![latest tag](https://badgen.net/github/tag/retypejs/jscanny)](https://github.com/retypejs/jscanny/tags) [![license](https://badgen.net/github/license/retypejs/jscanny)](https://github.com/retypejs/jscanny/blob/main/LICENSE)

Painless string scanning.

A JavaScript/TypeScript rewrite of [`typst/unscanny`](https://github.com/typst/unscanny).

## Contributing

Feel free to open an [issue](https://github.com/retypejs/jscanny/issues) or create a [pull request](https://github.com/retypejs/jscanny/pulls)!

## Installation

```
npm install @retypejs/jscanny
```

## Usage

`jscanny` is published as a CommonJS (CJS) module (that you can `require()`) as well as an ECMAScript module (ESM) (that you can `import`).

### CommonJS

```js
const { Scanner, Char, None, Some, Option } = require('@retypejs/jscanny');
```

### ESM

```js
import { Scanner, Char, None, Some, Option } from '@retypejs/jscanny';
```

## Example

Recognizing and parsing a simple comma-separated list of floats.

```js
const s = new Scanner(' +12 , -15.3, 14.3  ');
let nums = [];
while (!s.done()) {
    s.eatWhitespace();
    let start = s.cursor;
    s.eatIf(['+', '-']);
    s.eatWhile(Char.isAsciiDigit);
    s.eatIf('.');
    s.eatWhile(Char.isAsciiDigit);
    nums.push(parseFloat(s.from(start)));
    s.eatWhitespace();
    s.eatIf(',');
}
assert.deepEqual(nums, [12, -15.3, 14.3]);
```

## Testing

This JavaScript/TypeScript rewrite of [`unscanny`](https://github.com/typst/unscanny) passes the exact same tests as [`unscanny`](https://github.com/typst/unscanny) (compare [`jscanny/tests/scanner.test.ts`](https://github.com/retypejs/jscanny/blob/main/tests/scanner.test.ts) to the tests defined in [`unscanny/src/lib.rs`](https://github.com/typst/unscanny/blob/main/src/lib.rs)).

```sh
git clone https://github.com/retypejs/jscanny.git # Clone this repository
npm install # Install dependencies
npm run build # Compile TypeScript to JavaScript
npm run test # Run all tests
```

## License

[MIT](https://github.com/retypejs/jscanny/blob/main/LICENSE) © [Bastien Voirin](https://github.com/bastienvoirin)
