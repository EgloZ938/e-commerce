const { add, multiply } = require('./functions');

test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
});

test('multiplies two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
});

test('handles zero in addition', () => {
    expect(add(0, 5)).toBe(5);
});

test('handles zero in multiplication', () => {
    expect(multiply(0, 5)).toBe(0);
});