import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PaymentTypeSelectorProps {
  selectedPaymentType: string;
  onPaymentTypeChange: (value: string) => void;
}

const PaymentTypeSelector = ({ selectedPaymentType, onPaymentTypeChange }: PaymentTypeSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block text-dashboard-text">Payment Type</label>
      <ToggleGroup
        type="single"
        value={selectedPaymentType}
        onValueChange={onPaymentTypeChange}
        className="justify-start gap-4"
      >
        <ToggleGroupItem 
          value="yearly" 
          className="h-12 px-6 data-[state=on]:bg-dashboard-accent1 data-[state=on]:text-white border-dashboard-accent1/20"
        >
          Yearly Payment
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="emergency" 
          className="h-12 px-6 data-[state=on]:bg-dashboard-accent1 data-[state=on]:text-white border-dashboard-accent1/20"
        >
          Emergency Collection
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default PaymentTypeSelector;