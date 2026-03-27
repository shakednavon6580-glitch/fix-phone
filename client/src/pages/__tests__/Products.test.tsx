import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Products from '../Products';

// Mock contexts and components
vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({ cartItemsCount: 3, addToCart: vi.fn() })
}));
vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />
}));
vi.mock('@/components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar" />
}));

describe('Products UI Component Tests', () => {
  it('renders all 6 products with images, including SVG placeholders', () => {
    render(<Products />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);
  });

  it('renders the 3 bottom products with User attached images', () => {
    render(<Products />);
    const images = screen.getAllByRole('img') as HTMLImageElement[];
    const placeholders = images.filter(img => img.src.includes('galaxy_watch.png') || img.src.includes('macbook_air.png') || img.src.includes('dell_xps.png'));
    expect(placeholders).toHaveLength(3);
    
    const hasGalaxyWatch = placeholders.some(img => img.src.includes('galaxy_watch.png'));
    const hasMacbookAir = placeholders.some(img => img.src.includes('macbook_air.png'));
    const hasDellXps = placeholders.some(img => img.src.includes('dell_xps.png'));
    
    expect(hasGalaxyWatch).toBe(true);
    expect(hasMacbookAir).toBe(true);
    expect(hasDellXps).toBe(true);
  });

  it('verifies the floating cart button is positioned on the right to avoid chatbot overlap', () => {
    const { container } = render(<Products />);
    // Finding the specific div wrapping the floating cart button
    // The button has a fixed container at the bottom
    const floatingDiv = container.querySelector('.fixed.bottom-6');
    expect(floatingDiv).not.toBeNull();
    expect(floatingDiv).toHaveClass('right-6');
    expect(floatingDiv).not.toHaveClass('left-6');
  });

  it('verifies the cart button is clickable and responsive', () => {
    const { container } = render(<Products />);
    const button = container.querySelector('.rounded-full.shadow-2xl');
    expect(button).toBeEnabled();
  });
});
