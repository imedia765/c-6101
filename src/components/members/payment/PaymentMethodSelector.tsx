import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: 'cash' | 'bank_transfer';
  onPaymentMethodChange: (method: 'cash' | 'bank_transfer') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block text-dashboard-text">Payment Method</label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={paymentMethod === 'cash' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('cash')}
          className={`flex-1 h-12 ${
            paymentMethod === 'cash' 
              ? 'bg-dashboard-accent1 hover:bg-dashboard-accent1/80' 
              : 'border-dashboard-accent1/20 hover:bg-dashboard-accent1/10'
          }`}
        >
          <Banknote className="w-5 h-5 mr-2" />
          Cash
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('bank_transfer')}
          className={`flex-1 h-12 ${
            paymentMethod === 'bank_transfer' 
              ? 'bg-dashboard-accent1 hover:bg-dashboard-accent1/80' 
              : 'border-dashboard-accent1/20 hover:bg-dashboard-accent1/10'
          }`}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Bank Transfer
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;