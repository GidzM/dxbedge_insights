import { createClient } from '@supabase/supabase-js';

function toErrorMessage(error) {
  if (!error) {
    return null;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

async function checkTableRead(supabase, tableName) {
  try {
    const { error } = await supabase.from(tableName).select('id', { head: true, count: 'exact' }).limit(1);
    return {
      ok: !error,
      error: toErrorMessage(error),
    };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error),
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      ok: false,
      configured: false,
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseServiceRoleKey: Boolean(supabaseServiceRoleKey),
      hasSupabaseAnonKey: Boolean(supabaseAnonKey),
      message: 'Supabase environment variables are missing.',
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [leads, referrals, whatsappLogs] = await Promise.all([
    checkTableRead(supabase, 'leads'),
    checkTableRead(supabase, 'referrals'),
    checkTableRead(supabase, 'whatsapp_logs'),
  ]);

  const allOk = leads.ok && referrals.ok && whatsappLogs.ok;

  return res.status(200).json({
    ok: allOk,
    configured: true,
    usingKeyType: supabaseServiceRoleKey ? 'service_role' : 'anon',
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseServiceRoleKey: Boolean(supabaseServiceRoleKey),
    hasSupabaseAnonKey: Boolean(supabaseAnonKey),
    tables: {
      leads,
      referrals,
      whatsapp_logs: whatsappLogs,
    },
    timestamp: new Date().toISOString(),
  });
}
