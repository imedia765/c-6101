import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DatabaseAccessSectionProps {
  tables: string[];
}

const DatabaseAccessSection = ({ tables }: DatabaseAccessSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-dashboard-accent1" />
        <h5 className="font-medium text-white">Database Access</h5>
      </div>
      <div className="bg-dashboard-cardHover rounded-lg p-3">
        <div className="grid grid-cols-2 gap-2">
          {tables.map((table) => (
            <Badge key={table} variant="outline">
              {table}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatabaseAccessSection;