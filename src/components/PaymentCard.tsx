import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { PaymentDueDate } from './financials/payment-card/PaymentDueDate';
import { is_payment_overdue } from '@/lib/utils';

interface PaymentCardProps {
  annualPaymentStatus: 'pending' | 'completed';
  emergencyCollectionStatus: 'pending' | 'completed';
  emergencyCollectionAmount: number;
  annualPaymentDueDate?: string;
  emergencyCollectionDueDate?: string;
  lastAnnualPaymentDate?: string;
  lastEmergencyPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  lastEmergencyPaymentAmount?: number;
  memberNumber: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  annualPaymentStatus,
  emergencyCollectionStatus,
  emergencyCollectionAmount,
  annualPaymentDueDate,
  emergencyCollectionDueDate,
  lastAnnualPaymentDate,
  lastEmergencyPaymentDate,
  lastAnnualPaymentAmount,
  lastEmergencyPaymentAmount,
  memberNumber
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getAnnualPaymentStatusInfo = () => {
    if (annualPaymentStatus === 'completed') {
      return {
        message: 'Annual Payment Completed',
        isOverdue: false,
        isPaid: true
      };
    }
    
    if (annualPaymentDueDate) {
      const isOverdue = is_payment_overdue(new Date(annualPaymentDueDate));
      return {
        message: isOverdue ? 'Annual Payment Overdue!' : 'Annual Payment Due',
        isOverdue,
        isPaid: false
      };
    }
    
    return null;
  };

  const getEmergencyPaymentStatusInfo = () => {
    if (emergencyCollectionStatus === 'completed') {
      return {
        message: 'Emergency Payment Completed',
        isOverdue: false,
        isPaid: true
      };
    }
    
    if (emergencyCollectionDueDate) {
      const isOverdue = is_payment_overdue(new Date(emergencyCollectionDueDate));
      return {
        message: isOverdue ? 'Emergency Payment Overdue!' : 'Emergency Payment Due',
        isOverdue,
        isPaid: false
      };
    }
    
    return null;
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Annual Payment</h3>
        <Progress 
          value={annualPaymentStatus === 'completed' ? 100 : 0} 
          className="mt-2"
        />
        <p className="mt-1 text-sm">
          Status: {annualPaymentStatus}
        </p>
        {lastAnnualPaymentAmount && (
          <p className="text-sm">
            Last Payment: {formatCurrency(lastAnnualPaymentAmount)}
          </p>
        )}
        <PaymentDueDate
          dueDate={annualPaymentDueDate}
          color="text-dashboard-text"
          statusInfo={getAnnualPaymentStatusInfo()}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">Emergency Collection</h3>
        <Progress 
          value={emergencyCollectionStatus === 'completed' ? 100 : 0}
          className="mt-2"
        />
        <p className="mt-1 text-sm">
          Status: {emergencyCollectionStatus}
        </p>
        {lastEmergencyPaymentAmount && (
          <p className="text-sm">
            Last Payment: {formatCurrency(lastEmergencyPaymentAmount)}
          </p>
        )}
        <PaymentDueDate
          dueDate={emergencyCollectionDueDate}
          color="text-dashboard-text"
          statusInfo={getEmergencyPaymentStatusInfo()}
        />
      </div>
    </Card>
  );
};

export default PaymentCard;