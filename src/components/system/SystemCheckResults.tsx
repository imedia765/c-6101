import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStatusColor, getStatusIcon } from "./utils/systemCheckUtils";
import { SystemCheckDetailsTable } from "./SystemCheckDetailsTable";
import { SystemCheckActionButton } from "./SystemCheckActionButton";
import { SystemCheck } from "@/types/system";
import { Database } from "@/integrations/supabase/types";

interface SystemCheckResultsProps {
  checks: SystemCheck[];
}

type DatabaseFunctions = Database['public']['Functions'];
type FunctionName = keyof DatabaseFunctions;

type AssignCollectorParams = {
  member_id: string;
  collector_name: string;
  collector_prefix: string;
  collector_number: string;
};

type ValidateUserRolesParams = Record<PropertyKey, never>;

type AuditSecurityParams = Record<PropertyKey, never>;

type CheckMemberNumbersParams = Record<PropertyKey, never>;

type RPCFunctionParams = 
  | AssignCollectorParams
  | ValidateUserRolesParams
  | AuditSecurityParams
  | CheckMemberNumbersParams;

const getFixFunction = (checkType: string): FunctionName | null => {
  switch (checkType) {
    case 'Multiple Roles Assigned':
      return "perform_user_roles_sync";
    case 'Collectors Without Role':
      return "validate_user_roles";
    case 'Security Settings':
      return "audit_security_settings";
    case 'Member Number Issues':
      return "check_member_numbers";
    default:
      return null;
  }
};

const getFixParams = (functionName: FunctionName, details: any): RPCFunctionParams => {
  switch (functionName) {
    case 'assign_collector_role':
      return {
        member_id: details.member_id,
        collector_name: details.collector_name,
        collector_prefix: details.prefix,
        collector_number: details.number
      };
    case 'validate_user_roles':
    case 'audit_security_settings':
    case 'check_member_numbers':
      return {};
    default:
      return {};
  }
};

const SystemCheckResults = ({ checks }: SystemCheckResultsProps) => {
  const { toast } = useToast();
  
  const { data: memberNames } = useQuery({
    queryKey: ['member-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('auth_user_id, full_name');
      if (error) throw error;
      return data.reduce((acc: { [key: string]: string }, member) => {
        if (member.auth_user_id) {
          acc[member.auth_user_id] = member.full_name;
        }
        return acc;
      }, {});
    }
  });

  const handleFix = async (checkType: string, details: any) => {
    const functionName = getFixFunction(checkType);
    
    if (!functionName) {
      toast({
        title: "Action Not Available",
        description: "No automatic fix is available for this issue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const params = getFixParams(functionName, details);
      const { data: responseData, error } = await supabase.rpc(functionName, params);
      
      if (error) throw error;

      const message = typeof responseData === 'object' && responseData !== null && 'message' in responseData
        ? String(responseData.message)
        : `Successfully resolved ${checkType} issue`;

      toast({
        title: "Fix Applied",
        description: message,
      });
    } catch (error: any) {
      console.error('Fix error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to apply fix. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const groupedChecks = checks.reduce((acc: { [key: string]: SystemCheck[] }, check) => {
    if (!acc[check.check_type]) {
      acc[check.check_type] = [];
    }
    acc[check.check_type].push(check);
    return acc;
  }, {});

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'XCircle':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedChecks).map(([checkType, checksOfType], index) => (
        <Card 
          key={index}
          className={`border ${getStatusColor(checksOfType[0].status)} bg-dashboard-card/50`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIconComponent(getStatusIcon(checksOfType[0].status))}
                <CardTitle className="text-lg">
                  {checkType}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(checksOfType[0].status)}`}>
                    {checksOfType[0].status}
                  </span>
                </CardTitle>
              </div>
              <SystemCheckActionButton 
                checkType={checkType}
                details={checksOfType[0].details}
                onFix={handleFix}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-sm">
              <SystemCheckDetailsTable 
                checkType={checkType}
                details={checksOfType.length === 1 ? checksOfType[0].details : checksOfType.map(c => c.details)}
                memberNames={memberNames}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SystemCheckResults;