import { supabase } from "@/integrations/supabase/client";

export const updateMemberWithAuthId = async (memberId: string, authUserId: string) => {
  console.log('Updating member with auth_user_id');
  const { error: updateError } = await supabase
    .from('members')
    .update({ auth_user_id: authUserId })
    .eq('id', memberId);

  if (updateError) {
    console.error('Error updating member with auth_user_id:', updateError);
    throw updateError;
  }
};

export const addMemberRole = async (userId: string) => {
  console.log('Adding default member role');
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role: 'member' }]);

  if (roleError) {
    console.error('Error adding member role:', roleError);
    throw roleError;
  }
};