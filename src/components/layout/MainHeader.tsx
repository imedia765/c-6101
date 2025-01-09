import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainHeaderProps {
  onToggleSidebar: () => void;
}

const MainHeader = ({ onToggleSidebar }: MainHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dashboard-card/80 backdrop-blur-md border-b border-white/10">
      <div className="w-full bg-dashboard-card/50 py-2 text-center border-b border-white/10">
        <p className="text-lg text-white font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="text-xs text-dashboard-text">In the name of Allah, the Most Gracious, the Most Merciful</p>
      </div>
      
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-screen-2xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden text-dashboard-text hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center flex-1 lg:justify-start">
          <h1 className="text-lg font-semibold">
            <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500">
              PWA Burton
            </span>
            <span className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500">
              PWA
            </span>
          </h1>
        </div>

        <div className="w-10 lg:hidden">
          {/* Placeholder div to maintain center alignment */}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;