import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface MemberSearchProps {
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

const MemberSearch = ({ onSearchChange, searchTerm }: MemberSearchProps) => {
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name, member number or collector..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-dashboard-card border-white/10 focus:border-white/20"
        />
      </div>
    </div>
  );
};

export default MemberSearch;