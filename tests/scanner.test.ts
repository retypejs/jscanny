import { Scanner } from '../src/index';
import { ScanningError } from '../src/pattern';
import { Char, decode } from '../src/utf8';
import { assertEq, assertDeepEq, expect } from './assert';

describe('Test formatting with input "hello world"', () => {
    const s = new Scanner('hello world');
    assertEq(s.toString(), 'Scanner(| hello world)', 'Scanner(| hello world)');
    s.eatWhile((string: string) => /^[a-zA-Z]/.test(string));
    assertEq(s.toString(), 'Scanner(hello |  world)', 'Scanner(hello |  world)');
    s.eatWhile((string: string) => true);
    assertEq(s.toString(), 'Scanner(hello world |)', 'Scanner(hello world |)');
});

describe('Scanner with empty input string', () => {
    const s = new Scanner('');
    assertEq(s.cursor, 0, 'cursor should be at position 0');
    assertEq(s.done(), true, 'done() should be true');
    assertDeepEq(s.before(), '', 'before() should return an empty code points array');
    assertDeepEq(s.after(), '', 'after() should return an empty code points array');
    assertDeepEq(s.from(0), '', 'from(0) should return an empty code points array');
    assertDeepEq(s.from(10), '', 'from(10) should return an empty code points array');
    assertDeepEq(s.to(10), '', 'to(10) should be return empty code points array');
    assertDeepEq(s.to(10), '', 'to(10) should be return empty code points array');
    assertDeepEq(s.get([10, 20]), '', 'get([10, 20]) should return an empty code points array');
    assertEq(s.at(''), true, 'at("") should return true');
    assertEq(s.at('a'), false, 'at("a") should return false');
    assertEq(s.at(() => true), false, 'at(() => true) should return false');
    assertEq(s.scout(-1), null, 'scout(-1) should return null');
    assertEq(s.scout(-1), null, 'scout(-1) should return null');
    assertEq(s.scout(1), null, 'scout(1) should return null');
    assertEq(s.locate(-1), 0, 'locate(-1) should return 0');
    assertEq(s.locate(0), 0, 'locate(0) should return 0');
    assertEq(s.locate(1), 0, 'locate(1) should return 0');
    assertEq(s.eat(), null, 'eat() should return null');
    assertEq(s.uneat(), null, 'uneat() should return null');
    assertEq(s.eatIf(''), true, 'eatIf("") should return true');
    assertEq(s.eatIf('a'), false, 'eatIf("a") should return false');
    assertDeepEq(s.eatWhile(''), '', 'eatWhile("") should return []');
    assertDeepEq(s.eatWhile('a'), '', 'eatWhile("a") should return []');
    assertDeepEq(s.eatUntil(''), '', 'eatUntil("") should return []');
    assertDeepEq(s.eatWhitespace(), '', 'eatWhitespace() should return []');
});

describe('Test slice with input "zoo 🦍🌴🎍 party"', () => {
    const s = new Scanner('zoo 🦍🌴🎍 party');
    assertDeepEq(s.parts(), ['', 'zoo 🦍🌴🎍 party'], 'parts() should return the code points of "" and "zoo 🦍🌴🎍 party"');
    assertDeepEq(s.get([2, 9]), 'o 🦍', 'get([2, 9]) should return the code points of "o 🦍"');
    assertDeepEq(s.get([2, 22]), 'o 🦍🌴🎍 party', 'get([2, 22]) should return the code points of "o 🦍🌴🎍 party"');
    s.eatWhile(Char.isAscii);
    assertDeepEq(s.parts(), ['zoo ', '🦍🌴🎍 party'], 'parts() should return the code points of "zoo " and "🦍🌴🎍 party"');
    assertDeepEq(s.from(1), 'oo ', 'from(1) should return the code points of "oo "');
    assertDeepEq(s.to(15), '🦍🌴', 'to(15) shound return the code points of "🦍🌴"');
    assertDeepEq(s.to(16), '🦍🌴🎍', 'to(16) should return the code points of "🦍🌴🎍"');
    assertDeepEq(s.to(17), '🦍🌴🎍 ', 'to(17) should return the code points of "🦍🌴🎍 "');
    assertDeepEq(s.to(Infinity), '🦍🌴🎍 party', 'to(Infinity) should return the code points of "🦍🌴🎍 party"');
    s.eatUntil(Char.isWhitespace);
    assertDeepEq(s.parts(), ['zoo 🦍🌴🎍', ' party'], 'parts() should return the code points of "zoo 🦍🌴🎍" and " party"');
    assertDeepEq(s.from(3), ' 🦍🌴🎍', 'from(3) should return the code points of " 🦍🌴🎍"');
});

describe('Test done() and peek with input "äbc"', () => {
    const s = new Scanner('äbc');
    assertEq(s.done(), false, 'done() should be false');
    assertEq(s.peek(), 'ä', 'peek() should return "ä"');
    s.eat();
    assertEq(s.done(), false, 'done() should be false');
    assertEq(s.peek(), 'b', 'peek() should return "b"');
    s.eat();
    assertEq(s.done(), false, 'done() should be false');
    assertEq(s.peek(), 'c', 'peek() should return "c"');
    s.eat();
    assertEq(s.done(), true, 'done() should be true');
    assertEq(s.peek(), null, 'peek() should return null');
});

describe('Test at with input "Ђ12"', () => {
    const s = new Scanner('Ђ12');
    assertEq(s.at('Ђ'), true, 'at("Ђ") should return true');
    assertEq(s.at(['b', 'Ђ', 'Њ']), true, 'at(["b", "Ђ", "Њ"]) should return true');
    assertEq(s.at('Ђ'), true, 'at("Ђ") should return true');
    assertEq(s.at('Ђ1'), true, 'at("Ђ1") should return true');
    assertEq(s.at(Char.isAlphabetic), true, 'at(Char.isAlphabetic) should return true');
    assertEq(s.at(['b', 'c']), false, 'at(["b", "c"]) should return false');
    assertEq(s.at('a13'), false, 'at("a13") should return false');
    assertEq(s.at(Char.isNumeric), false, 'at(Char.isNumeric) should return false');
    s.eat();
    assertEq(s.at(Char.isNumeric), true, 'at(Char.isNumeric) should return true');
    assertEq(s.at(Char.isAsciiDigit), true, 'at(Char.isAsciiDigit) should return true');
});

describe('Test scout and locate with input "a🐆c1Ф"', () => {
    const s = new Scanner('a🐆c1Ф');
    s.eatUntil(Char.isNumeric);
    assertEq(s.scout(-4), null, 'scout(-4) should return null');
    assertEq(s.scout(-3), 'a', 'scout(-3) should return the UTF-8 bytes of "a"');
    assertEq(s.scout(-2), '🐆', 'scout(-2) should return the UTF-8 bytes of "🐆"');
    assertEq(s.scout(-1), 'c', 'scout(-1) should return the UTF-8 bytes of "c"');
    assertEq(s.scout(0), '1', 'scout(0) should return the UTF-8 bytes of "1"');
    assertEq(s.scout(1), 'Ф', 'scout(1) should return the UTF-8 bytes of "Ф"');
    assertEq(s.scout(2), null, 'scout(2) should return null');
    assertEq(s.locate(-4), 0, 'locate(-4) should return 0');
    assertEq(s.locate(-3), 0, 'locate(-3) should return 0');
    assertEq(s.locate(-2), 1, 'locate(-2) should return 1');
    assertEq(s.locate(-1), 5, 'locate(-1) should return 5');
    assertEq(s.locate(0), 6, 'locate(0) should return 6');
    assertEq(s.locate(1), 7, 'locate(1) should return 7');
    assertEq(s.locate(2), 9, 'locate(2) should return 9');
    assertEq(s.locate(3), 9, 'locate(3) should return 9');
});

describe('Test eat and uneat with input "🐶🐱🐭"', () => {
    const s = new Scanner('🐶🐱🐭');
    assertEq(s.eat(), '🐶', 'eat() should return 🐶');
    s.jump(Infinity);
    assertEq(s.uneat(), '🐭', 'uneat() should return 🐭');
    assertEq(s.uneat(), '🐱', 'uneat() should return 🐱');
    assertEq(s.uneat(), '🐶', 'uneat() should return 🐶');
    assertEq(s.uneat(), null, 'uneat() should return null');
    assertEq(s.eat(), '🐶', 'eat() should return 🐶');
});

describe('Test conditional and looping with input "abc123def33"', () => {
    const s = new Scanner('abc123def33');
    assertEq(s.eatIf('b'), false, 'eatIf("b") should return false');
    assertEq(s.eatIf('a'), true, 'eatIf("a") should return true');
    assertDeepEq(s.eatWhile(['a', 'b', 'c']), 'bc', 'eatWhile(["a", "b", "c"]) should return "bc"');
    assertDeepEq(s.eatWhile(Char.isNumeric), '123', 'eatWhile(isNumeric) should return "123"');
    assertDeepEq(s.eatUntil(Char.isNumeric), 'def', 'eatUntil(isNumeric) should return "def"');
    assertDeepEq(s.eatWhile('3'), '33', 'eatWhile("3") should return "33"');
});

describe('Test eatWhitespace with input "ሙም  \\n  b\\tቂ"', () => {
    const s = new Scanner('ሙም  \n  b\tቂ');
    assertEq(s.eatWhitespace(), '', 'eatWhitespace() should return ""');
    assertEq(s.eatWhile(Char.isAlphabetic), 'ሙም', 'eatWhile(Char.isAlphabetic) should return "ሙም"');
    assertEq(s.eatWhitespace(), '  \n  ', 'eatWhitespace() should return "  \\n  "');
    assertEq(s.eatIf('b'), true, 'eatIf("b") should return true');
    assertEq(s.eatWhitespace(), '\t', 'eatWhitespace() should return "\\t"');
    assertEq(s.eatWhile(Char.isAlphabetic), 'ቂ', 'eatWhile(Char.isAlphabetic) should return "ቂ"');
});

describe('Test expect okay', () => {
    const s = new Scanner('🦚12');
    s.expect('🦚');
    s.jump(1);
    s.expect('🦚');
    assertEq(s.after(), '12', 's.after() should give the UTF-8 bytes of "12"');
});

describe('Text expect string fail', () => {
    it('should throw a scanning error reading "expected \'🐢\'"', () => {
        const s = new Scanner('no turtle in sight');
        expect(() => s.expect('🐢')).to.throw(ScanningError, "expected '🐢'");
    });
});

describe('Test expect empty array fail', () => {
    it('should throw a scanning error reading "empty slice cannot match"', () => {
        const s = new Scanner('');
        expect(() => s.expect([])).to.throw(ScanningError, "empty slice cannot match");
    });
});

describe('Test expect closure fail', () => {
    it('should throw a scanning error reading "expected closure to return \`true\`"', () => {
        const s = new Scanner('no numbers in sight');
        expect(() => s.expect(Char.isNumeric)).to.throw(ScanningError, `expected closure to return \`true\``);
    });
});