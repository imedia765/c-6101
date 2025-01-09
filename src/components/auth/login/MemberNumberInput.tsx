import { Input } from "@/components/ui/input";

interface MemberNumberInputProps {
  memberNumber: string;
  setMemberNumber: (value: string) => void;
  loading: boolean;
}

const MemberNumberInput = ({ memberNumber, setMemberNumber, loading }: MemberNumberInputProps) => {
  return (
    <div>
      <label htmlFor="memberNumber" className="block text-sm font-medium text-dashboard-text mb-2">
        Member Number
      </label>
      <Input
        id="memberNumber"
        type="text"
        value={memberNumber}
        onChange={(e) => setMemberNumber(e.target.value.toUpperCase())}
        placeholder="Enter your member number"
        className="w-full"
        required
        disabled={loading}
        autoComplete="off"
      />
    </div>
  );
};

export default MemberNumberInput;