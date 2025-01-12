import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Member } from "@/types/member";
import { downloadExcel, downloadCSV } from "@/utils/exportFormatters";

interface DownloadButtonsProps {
  members: Member[];
  collectorName?: string;
  className?: string;
}

const DownloadButtons = ({ members, collectorName, className = "" }: DownloadButtonsProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={() => downloadExcel(members, collectorName)}
        className="flex-1 items-center gap-2 bg-dashboard-accent3 hover:bg-dashboard-accent3/80"
      >
        <Download className="w-4 h-4" />
        Excel
      </Button>
      <Button
        onClick={() => downloadCSV(members, collectorName)}
        className="flex-1 items-center gap-2 bg-dashboard-accent3 hover:bg-dashboard-accent3/80"
      >
        <Download className="w-4 h-4" />
        CSV
      </Button>
    </div>
  );
};

export default DownloadButtons;