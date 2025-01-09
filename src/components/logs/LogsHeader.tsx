import React from 'react';

interface LogsHeaderProps {
  title: string;
  subtitle: string;
}

const LogsHeader: React.FC<LogsHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default LogsHeader;