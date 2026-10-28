import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout Integration', () => {
  it('renders top toolbar with CodeShot branding and action controls', () => {
    render(<AppLayout />);

    expect(screen.getByText('CodeShot')).toBeDefined();
    expect(screen.getByLabelText('Export PNG')).toBeDefined();
    expect(screen.getByLabelText('Copy Image')).toBeDefined();
    expect(screen.getByLabelText('Current programming language')).toBeDefined();
    expect(screen.getByText('EN')).toBeDefined();
  });

  it('renders editor, preview canvas, and appearance inspector panels', () => {
    render(<AppLayout />);

    expect(screen.getByLabelText('Source Code Editor')).toBeDefined();
    expect(screen.getByLabelText('Screenshot Preview Canvas')).toBeDefined();
    expect(screen.getByLabelText('Appearance Inspector')).toBeDefined();
  });
});
