import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges conditional and conflicting Tailwind classes', () => {
    const shouldHide = false;
    expect(cn('px-2 text-sm', 'px-4', shouldHide ? 'hidden' : undefined, ['font-bold'])).toBe(
      'text-sm px-4 font-bold'
    );
  });
});
