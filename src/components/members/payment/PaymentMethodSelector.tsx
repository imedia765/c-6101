import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: 'cash' | 'bank_transfer';
  onPaymentMethodChange: (method: 'cash' | 'bank_transfer') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <label className="form-label">Payment Method</label>
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => onPaymentMethodChange('cash')}
          className={`flex-1 h-12 ${
            paymentMethod === 'cash' 
              ? 'bg-dashboard-accent1 text-white hover:bg-dashboard-accent1/90' 
              : 'bg-dashboard-card hover:bg-dashboard-cardHover text-dashboard-text'
          }`}
        >
          <Banknote className="w-5 h-5 mr-2" />
          Cash
        </Button>
        <Button
          type="button"
          onClick={() => onPaymentMethodChange('bank_transfer')}
          className={`flex-1 h-12 ${
            paymentMethod === 'bank_transfer' 
              ? 'bg-dashboard-accent2 text-white hover:bg-dashboard-accent2/90' 
              : 'bg-dashboard-card hover:bg-dashboard-cardHover text-dashboard-text'
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