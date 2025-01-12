import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
  it('renders a button with text', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});