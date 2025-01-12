import { Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoutesSectionProps {
  routes: {
    [key: string]: boolean;
  };
}

const RoutesSection = ({ routes }: RoutesSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Route className="w-4 h-4 text-dashboard-accent1" />
        <h5 className="font-medium text-white">Accessible Routes</h5>
      </div>
      <div className="bg-dashboard-cardHover rounded-lg p-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(routes).map(([route, hasAccess]) => (
            <div key={route} className="flex items-center gap-2">
              <Badge variant={hasAccess ? "default" : "secondary"}>
                {route}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutesSection;