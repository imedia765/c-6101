import MemberSearch from "@/components/MemberSearch";

interface MembersListFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const MembersListFilters = ({ searchTerm, onSearchChange }: MembersListFiltersProps) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-medium mb-2 text-white">Members</h1>
      <p className="text-dashboard-muted">View and manage member information</p>
      <div className="mt-4">
        <MemberSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
    </header>
  );
};

export default MembersListFilters;