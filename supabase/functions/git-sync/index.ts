import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function validateGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      throw new Error('Invalid GitHub URL');
    }
    
    const match = url.match(/github\.com\/([^\/]+)\/([^\.]+)(?:\.git)?$/);
    if (!match) {
      throw new Error('Invalid repository URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2]
    };
  } catch (error) {
    console.error('URL validation error:', error);
    return null;
  }
}

async function getGitHubReference(owner: string, repo: string, ref: string, token: string) {
  console.log(`Getting reference for ${owner}/${repo}#${ref}`);
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${ref}`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Reference ${ref} not found in ${owner}/${repo}`);
        return null;
      }
      throw new Error(`Failed to get reference: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('Successfully got reference:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error getting reference:', error);
    throw error;
  }
}

async function createGitHubReference(owner: string, repo: string, ref: string, sha: string, token: string) {
  console.log(`Creating reference refs/heads/${ref} in ${owner}/${repo} pointing to ${sha}`);
  
  try {
    // First check if there are any commits in the repository
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to check commits: ${await response.text()}`);
    }

    const commits = await response.json();
    if (!commits || commits.length === 0) {
      throw new Error('Cannot create reference in empty repository');
    }

    const createResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: `refs/heads/${ref}`,
          sha: sha,
        }),
      }
    );

    if (!createResponse.ok) {
      throw new Error(`Failed to create reference: ${await createResponse.text()}`);
    }

    const data = await createResponse.json();
    console.log('Successfully created reference:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error creating reference:', error);
    throw error;
  }
}

async function updateGitHubReference(owner: string, repo: string, ref: string, sha: string, token: string) {
  console.log(`Updating reference for ${owner}/${repo}#${ref} with SHA ${sha}`);
  
  try {
    const existingRef = await getGitHubReference(owner, repo, ref, token);
    
    if (!existingRef) {
      console.log(`Reference doesn't exist, creating new one`);
      return await createGitHubReference(owner, repo, ref, sha, token);
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${ref}`,
      {
        method: 'PATCH',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: sha,
          force: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error updating reference:', errorText);
      throw new Error(`Failed to update reference: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully updated reference:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error updating reference:', error);
    throw error;
  }
}

async function performGitSync(operation: string, customUrl: string, masterUrl: string, githubToken: string) {
  // Validate URLs
  const customRepo = validateGitHubUrl(customUrl);
  const masterRepo = validateGitHubUrl(masterUrl);
  
  if (!customRepo || !masterRepo) {
    throw new Error('Invalid repository URLs provided');
  }

  // Get master branch reference
  const masterRef = await getGitHubReference(masterRepo.owner, masterRepo.repo, 'main', githubToken);
  if (!masterRef) {
    throw new Error('Master branch reference not found');
  }

  // Update or create custom branch reference
  await updateGitHubReference(customRepo.owner, customRepo.repo, 'main', masterRef.object.sha, githubToken);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const githubToken = Deno.env.get('GITHUB_PAT');
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const { operation, customUrl, masterUrl } = await req.json();
    console.log('Processing git sync operation:', { operation, customUrl, masterUrl });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError) throw userError;
    console.log('User authenticated:', user.id);

    // Create operation log
    const { error: logError } = await supabase
      .from('git_sync_logs')
      .insert({
        operation_type: operation,
        status: 'completed',
        message: `Successfully verified access to ${customUrl}`,
        created_by: user.id,
      });

    if (logError) throw logError;

    if (masterUrl) {
      console.log(`Performing ${operation} between ${customUrl} and ${masterUrl}`);
      await performGitSync(operation, customUrl, masterUrl, githubToken);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in git-sync:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})