import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file');
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    // Try to query Supabase - this will verify the connection
    const { error } = await supabase.from('test_table').select('*').limit(1);
    
    // If error is just that table doesn't exist, connection is still OK
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.error('⚠️  Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

export default supabase;