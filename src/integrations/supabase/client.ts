// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gnsmwgwxszslnteqzmoa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc213Z3d4c3pzbG50ZXF6bW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTg2MjAsImV4cCI6MjA2MTU5NDYyMH0.-r1cQaXexP_HpOROdpurjaW3-uKnKB8tA5Yrlh4SFpw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);