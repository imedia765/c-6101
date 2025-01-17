import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Query for mismatched collector assignments
    const { data: mismatches, error } = await supabase
      .from('payment_requests')
      .select(`
        id,
        member_id,
        collector_id,
        members!payment_requests_member_id_fkey (
          collector,
          member_number
        ),
        members_collectors!payment_requests_collector_id_fkey (
          name
        )
      `)
      .neq('members_collectors.name', 'members.collector')

    if (error) {
      console.error('Error checking collector assignments:', error)
      throw error
    }

    const response = {
      success: true,
      mismatches: mismatches || [],
      message: mismatches?.length 
        ? `Found ${mismatches.length} mismatched collector assignments` 
        : 'No mismatched collector assignments found'
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})