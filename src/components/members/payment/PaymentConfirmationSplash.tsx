import React from 'react';
import { CheckCircle2, XCircle, Phone, User, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PaymentConfirmationSplashProps {
  success: boolean;
  paymentRef?: string;
  amount: number;
  paymentType: string;
  memberNumber: string;
  onClose: () => void;
}

const PaymentConfirmationSplash = ({
  success,
  paymentRef,
  amount,
  paymentType,
  memberNumber,
  onClose
}: PaymentConfirmationSplashProps) => {
  // Fetch payment number and collector information based on payment reference
  const { data: paymentInfo } = useQuery({
    queryKey: ['payment-info', paymentRef],
    queryFn: async () => {
      if (!paymentRef) return null;

      const { data, error } = await supabase
        .from('payment_requests')
        .select('payment_number')
        .eq('id', paymentRef)
        .maybeSingle();

      if (error) {
        console.error('Error fetching payment info:', error);
        return null;
      }

      return data;
    },
    enabled: success && !!paymentRef
  });

  // Fetch collector information based on member number
  const { data: collectorInfo } = useQuery({
    queryKey: ['collector-info', memberNumber],
    queryFn: async () => {
      if (!memberNumber) return null;

      const { data, error } = await supabase
        .from('members_collectors')
        .select('name, phone')
        .eq('member_number', memberNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching collector info:', error);
        return null;
      }

      return data;
    },
    enabled: success && !!memberNumber
  });

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      success ? 'bg-dashboard-success/95' : 'bg-dashboard-error/95'
    } animate-fade-in`}>
      <div className="relative bg-dashboard-card rounded-lg p-6 max-w-md w-full space-y-4 animate-scale-in border border-dashboard-cardBorder">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-dashboard-text hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center">
          {success ? (
            <CheckCircle2 className="w-16 h-16 text-dashboard-success" />
          ) : (
            <XCircle className="w-16 h-16 text-dashboard-error" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-center text-white">
          {success ? 'Payment Confirmed' : 'Payment Failed'}
        </h2>
        {success && paymentInfo?.payment_number && (
          <div className="space-y-2">
            <div className="bg-dashboard-cardHover p-4 rounded-md space-y-2 border border-dashboard-cardBorder">
              <p className="text-sm text-dashboard-text">Payment Number</p>
              <p className="font-mono font-medium text-white">{paymentInfo.payment_number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-dashboard-text">Amount</p>
              <p className="font-medium text-white">£{amount.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-dashboard-text">Payment Type</p>
              <p className="font-medium text-white capitalize">{paymentType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-dashboard-text">Member Number</p>
              <p className="font-medium text-white">{memberNumber}</p>
            </div>
            
            {collectorInfo && (
              <div className="mt-6 border-t border-dashboard-cardBorder pt-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Contact Your Collector</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-dashboard-text">
                    <User className="w-4 h-4" />
                    <span>{collectorInfo.name}</span>
                  </div>
                  {collectorInfo.phone && (
                    <div className="flex items-center gap-2 text-dashboard-text">
                      <Phone className="w-4 h-4" />
                      <span>{collectorInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {!success && (
          <p className="text-center text-dashboard-text">
            Please try again or contact support if the problem persists.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmationSplash;