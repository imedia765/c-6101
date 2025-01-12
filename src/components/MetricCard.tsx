import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent } from './ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: number;
  color: string;
  details?: string;
  threshold?: number;
}

const MetricCard = ({ title, subtitle, value, color, details, threshold }: MetricCardProps) => {
  const getStatusColor = (value: number, threshold?: number) => {
    if (!threshold) return color;
    if (value > threshold) return '#ef4444';
    if (value > threshold * 0.8) return '#f59e0b';
    return '#22c55e';
  };

  const statusColor = getStatusColor(value, threshold);

  return (
    <Card className="p-4 bg-dashboard-card/50 border-dashboard-cardBorder hover:border-dashboard-cardBorderHover transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-dashboard-text">{title}</h3>
              {details && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-dashboard-muted" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{details}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {subtitle && <p className="text-sm text-dashboard-muted mt-1">{subtitle}</p>}
          </div>
          <div className="w-24 h-24">
            <CircularProgressbar
              value={value}
              text={`${value}%`}
              styles={buildStyles({
                textSize: '1.25rem',
                pathColor: statusColor,
                textColor: statusColor,
                trailColor: 'rgba(255,255,255,0.1)',
              })}
            />
          </div>
        </div>
        {threshold && (
          <div className="text-sm text-dashboard-muted">
            Threshold: {threshold}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;