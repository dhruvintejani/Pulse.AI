import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges conditional and conflicting Tailwind classes', () => {
    expect(cn('px-2 text-sm', 'px-4', false && 'hidden', ['font-bold'])).toBe('text-sm px-4 font-bold');
  });
});
