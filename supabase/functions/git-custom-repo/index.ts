import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting custom repo git operation...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Invalid token')
    }

    console.log('User authenticated:', user.id)

    // Verify GitHub token exists
    const githubToken = Deno.env.get('GITHUB_PAT')
    if (!githubToken) {
      console.error('GitHub PAT not configured')
      throw new Error('GitHub token not configured')
    }

    const { repoId, commitMessage = 'Update from dashboard' } = await req.json()
    console.log('Processing request for repo ID:', repoId)

    // Get repository configuration
    const { data: repoConfig, error: repoError } = await supabase
      .from('git_repository_configs')
      .select('*')
      .eq('id', repoId)
      .single()

    if (repoError || !repoConfig) {
      console.error('Repository config error:', repoError)
      throw new Error('Repository configuration not found')
    }

    console.log('Found repo config:', {
      url: repoConfig.repo_url,
      branch: repoConfig.branch
    })

    // Extract owner and repo from the URL
    const repoUrl = repoConfig.repo_url.replace(/\.git$/, '')
    const repoUrlParts = repoUrl
      .replace('https://github.com/', '')
      .split('/')
    
    if (repoUrlParts.length !== 2) {
      console.error('Invalid repo URL format:', repoConfig.repo_url)
      throw new Error('Invalid repository URL format')
    }

    const [owner, repo] = repoUrlParts
    console.log('Parsed repo details:', { owner, repo })

    // Log operation start
    await supabase.from('git_operations_logs').insert({
      operation_type: 'push',
      status: 'started',
      created_by: user.id,
      message: `Starting push operation to ${repoConfig.repo_url}`
    })

    // Verify repository access
    const repoCheckResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function'
        }
      }
    )

    if (!repoCheckResponse.ok) {
      const errorData = await repoCheckResponse.text()
      console.error('Repository check failed:', errorData)
      
      await supabase.from('git_operations_logs').insert({
        operation_type: 'push',
        status: 'failed',
        created_by: user.id,
        message: `Repository access failed: ${errorData}`
      })
      
      throw new Error(`Repository access failed: ${errorData}`)
    }

    console.log('Repository access verified')

    // Log success
    await supabase.from('git_operations_logs').insert({
      operation_type: 'push',
      status: 'completed',
      created_by: user.id,
      message: `Successfully verified access to ${repoConfig.repo_url}`
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in git-custom-repo:', error)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      await supabase.from('git_operations_logs').insert({
        operation_type: 'push',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})