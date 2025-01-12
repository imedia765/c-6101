import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TestResultsTable from '../TestResultsTable';

describe('TestResultsTable Component', () => {
  const mockResults = [
    {
      metric_name: 'System Health',
      status: 'good',
      details: { message: 'All systems operational' },
      type: 'system'
    },
    {
      metric_name: 'Performance Check',
      status: 'warning',
      current_value: 85.5,
      threshold: 90,
      details: { message: 'Performance degraded' },
      type: 'performance'
    },
    {
      metric_name: 'Security Audit',
      status: 'critical',
      details: { message: 'Security vulnerability detected' },
      type: 'security'
    }
  ];

  it('renders test results correctly', () => {
    render(<TestResultsTable results={mockResults} type="system" />);
    
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('good')).toBeInTheDocument();
  });

  it('displays performance metrics when type is performance', () => {
    render(<TestResultsTable results={mockResults} type="performance" />);
    
    expect(screen.getByText('85.50')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('shows correct status badges with appropriate styling', () => {
    render(<TestResultsTable results={mockResults} type="system" />);
    
    const goodBadge = screen.getByText('good');
    const criticalBadge = screen.getByText('critical');
    
    expect(goodBadge).toHaveClass('bg-dashboard-success/10');
    expect(criticalBadge).toHaveClass('bg-dashboard-error/10');
  });

  it('opens details dialog when clicking the details button', async () => {
    render(<TestResultsTable results={mockResults} type="system" />);
    
    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]);
    
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
  });

  it('handles empty results gracefully', () => {
    const { container } = render(<TestResultsTable results={[]} type="system" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('groups results by metric name correctly', () => {
    const groupedResults = [
      { metric_name: 'Group A', status: 'good', details: {} },
      { metric_name: 'Group A', status: 'warning', details: {} }
    ];
    
    render(<TestResultsTable results={groupedResults} type="system" />);
    const groupHeaders = screen.getAllByText('Group A');
    expect(groupHeaders).toHaveLength(1);
  });
});