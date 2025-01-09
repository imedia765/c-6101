import { Users } from 'lucide-react';

interface TotalCountItem {
  count: number | string;
  label: string;
  icon?: React.ReactNode;
  onPrint?: () => void;
}

interface TotalCountProps {
  items?: TotalCountItem[];
  // Support for legacy props
  count?: number | string;
  label?: string;
  icon?: React.ReactNode;
  onPrint?: () => void;
}

const TotalCount = ({ items, count, label, icon, onPrint }: TotalCountProps) => {
  // If legacy props are provided, convert them to items format
  const displayItems = items || (count !== undefined ? [{ count, label: label || '', icon, onPrint }] : []);

  return (
    <div className="glass-card p-2 sm:p-3 md:p-4">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
        {displayItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer" 
            onClick={item.onPrint}
          >
            {item.icon}
            <div>
              <p className="text-xs sm:text-sm text-dashboard-muted line-clamp-1">{item.label}</p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-dashboard-accent1">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCount;