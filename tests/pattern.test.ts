import { Pattern } from '../src/pattern';
import { encode } from '../src/utf8';
import { assertEq, assertDeepEq } from './assert';

describe('Patterns', () => {
    describe('String pattern', () => {
        const p = Pattern.from('hello');
        assertEq(p.pattern, 'hello', 'pattern should be "hello"',);
        assertEq(p.matches(encode('hello world')), 5, 'pattern should match 5 bytes in "hello world"');
        assertEq(p.matches(encode('world')), null, 'pattern should match no bytes in "world"');
    });
    
    describe('String array pattern', () => {
        const p = Pattern.from(['i', 'j']);
        assertDeepEq(p.pattern, ['i', 'j'], 'pattern should be ["i", "j"]');
        assertEq(p.matches(encode('ijk')), 1, 'pattern should match 1 code point in "ijk"');
        assertEq(p.matches(encode('abc')), null, 'pattern should match no code points in "abc"');
    });
    
    describe('RegExp pattern', () => {
        const p = Pattern.from(/^[0-9]/);
        assertDeepEq(p.pattern, /^[0-9]/, 'pattern should be /^[0-9]/');
        assertEq(p.matches(encode('123')), 1, 'pattern should match 1 code point in "123"');
        assertEq(p.matches(encode('abc')), null, 'pattern should match no code points in "abc"');
    });

    describe('Closure pattern', () => {
        const p = Pattern.from((string: string) => string.startsWith(':'));
        assertEq(p.matches(encode('://')), 1, 'pattern should match 1 code point in "://"');
        assertEq(p.matches(encode('abc')), null, 'pattern should match no code points in "abc"');
    });
});