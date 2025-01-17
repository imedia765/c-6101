import { Member } from "@/types/member";
import RoleBadge from "./RoleBadge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Banknote, FileText, Printer, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface MembershipDetailsProps {
  memberProfile: Member;
  userRole: string | null;
}

type AppRole = 'admin' | 'collector' | 'member';

interface BankDetails {
  accountNumber: string;
  sortCode: string;
  bankName: string;
  bankAddress: string;
}

const MembershipDetails = ({ memberProfile, userRole }: MembershipDetailsProps) => {
  const { toast } = useToast();
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: '',
    sortCode: '',
    bankName: '',
    bankAddress: '',
  });
  const [showDialog, setShowDialog] = useState(false);

  const { data: userRoles } = useQuery({
    queryKey: ['userRoles', memberProfile.auth_user_id],
    queryFn: async () => {
      if (!memberProfile.auth_user_id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', memberProfile.auth_user_id);

      if (error) {
        console.error('Error fetching roles:', error);
        return [];
      }

      return data.map(r => r.role) as AppRole[];
    },
    enabled: !!memberProfile.auth_user_id
  });

  const { data: lastPayment } = useQuery({
    queryKey: ['lastPayment', memberProfile.member_number],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('member_number', memberProfile.member_number)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching last payment:', error);
        return null;
      }

      return data;
    },
    enabled: !!memberProfile.member_number
  });

  const generateStandingOrderText = (details: BankDetails) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const paymentDate = format(nextYear, 'dd/MM/yyyy');
    
    return `
HSBC Bank Standing Order Form

To: ${details.bankName}
${details.bankAddress}

Please set up a Standing Order from my account:

Your Name: ${memberProfile.full_name}
Your Address: ${memberProfile.address || ''} ${memberProfile.postcode || ''}

Your Account Number: ${details.accountNumber}
Your Sort Code: ${details.sortCode}

To pay:

Beneficiary Name: Pakistan Welfare Association
Bank: HSBC Bank
Sort Code: 40-15-34
Account Number: 41024892
Reference: ${memberProfile.member_number}

Amount: £40.00
Frequency: Annually
First Payment Date: ${paymentDate}
Until Further Notice

Signature: _________________
Date: _________________

Please return this form to your bank.`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      const formContent = generateStandingOrderText(bankDetails);
      printWindow.document.write(`
        <html>
          <head>
            <title>Standing Order Form</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            ${formContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleGenerateStandingOrder = () => {
    const formContent = generateStandingOrderText(bankDetails);
    navigator.clipboard.writeText(formContent).then(() => {
      toast({
        title: "Standing Order Form Generated",
        description: "The form has been copied to your clipboard. You can now paste it into a document.",
      });
      setShowDialog(false);
    }).catch(() => {
      toast({
        title: "Could not copy automatically",
        description: "Please manually copy the form text.",
        variant: "destructive",
      });
    });
  };

  const getHighestRole = (roles: AppRole[]): AppRole | null => {
    if (roles?.includes('admin')) return 'admin';
    if (roles?.includes('collector')) return 'collector';
    if (roles?.includes('member')) return 'member';
    return null;
  };

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-dashboard-accent3/20 text-dashboard-accent3';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-dashboard-muted/20 text-dashboard-muted';
    }
  };

  const displayRole = userRoles?.length ? getHighestRole(userRoles) : userRole;

  return (
    <div className="space-y-2">
      <p className="text-dashboard-muted text-sm">Membership Details</p>
      <div className="space-y-2">
        <div className="text-dashboard-text flex items-center gap-2">
          Status:{' '}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            memberProfile?.status === 'active' 
              ? 'bg-dashboard-accent3/20 text-dashboard-accent3' 
              : 'bg-dashboard-muted/20 text-dashboard-muted'
          }`}>
            {memberProfile?.status || 'Pending'}
          </span>
        </div>
        {memberProfile?.collector && (
          <div className="text-dashboard-text flex items-center gap-2">
            <span className="text-dashboard-muted">Collector:</span>
            <span className="text-dashboard-accent1">{memberProfile.collector}</span>
          </div>
        )}
        
        <div className="text-dashboard-text flex items-center gap-2">
          <span className="text-dashboard-accent2">Type:</span>
          <span className="flex items-center gap-2">
            {memberProfile?.membership_type || 'Standard'}
            <RoleBadge role={displayRole} />
          </span>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-4 bg-dashboard-softBlue hover:bg-blue-400 text-blue-700 border border-blue-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Standing Order Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-dashboard-card border-dashboard-cardBorder h-[95vh] sm:h-auto overflow-y-auto p-4 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-dashboard-text">Standing Order Form</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              <Alert className="mb-4 bg-dashboard-accent1/10 border-dashboard-accent1/20">
                <AlertCircle className="h-4 w-4 text-dashboard-accent1" />
                <AlertDescription className="text-yellow-400 text-sm">
                  Please note: Standing orders can only be set up for next year's payment. This cannot be used for your current payment which must be paid directly to your collector. You can also set up a standing order through your banking app or online banking portal.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="bankName" className="text-dashboard-text">Bank Name</label>
                  <Input
                    id="bankName"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Enter your bank's name"
                    className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text placeholder:text-dashboard-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="bankAddress" className="text-dashboard-text">Bank Address</label>
                  <Input
                    id="bankAddress"
                    value={bankDetails.bankAddress}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bankAddress: e.target.value }))}
                    placeholder="Enter your bank's address"
                    className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text placeholder:text-dashboard-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="accountNumber" className="text-dashboard-text">Account Number</label>
                  <Input
                    id="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter your account number"
                    className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text placeholder:text-dashboard-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="sortCode" className="text-dashboard-text">Sort Code</label>
                  <Input
                    id="sortCode"
                    value={bankDetails.sortCode}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, sortCode: e.target.value }))}
                    placeholder="XX-XX-XX"
                    className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text placeholder:text-dashboard-muted"
                  />
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 pt-4 bg-dashboard-card border-t border-dashboard-cardBorder mt-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleGenerateStandingOrder} className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white">
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="text-dashboard-text p-4 bg-dashboard-card rounded-lg border border-dashboard-cardBorder mt-4">
          {lastPayment ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getPaymentStatusColor(lastPayment.status)}`}>
                  {lastPayment.status}
                </span>
                <span className="text-dashboard-accent1 text-xl font-semibold">£{lastPayment.amount}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-dashboard-muted">Reference:</span>
                    <span className="ml-2 text-white font-medium">{lastPayment.payment_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-dashboard-muted">Date:</span>
                    <span className="ml-2 text-white">
                      {lastPayment.created_at ? format(new Date(lastPayment.created_at), 'dd MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-dashboard-muted">Method:</span>
                  <div className="flex items-center gap-2 text-white">
                    {lastPayment.payment_method === 'cash' ? (
                      <>
                        <Banknote className="w-4 h-4 text-dashboard-accent3" />
                        <span>Cash</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-dashboard-accent2" />
                        <span>Bank Transfer</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-dashboard-muted">No payments found</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipDetails;
