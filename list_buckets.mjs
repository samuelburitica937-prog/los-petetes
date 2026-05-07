import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cagaxhhtizrfmhtvlkps.supabase.co',
  'sb_publishable_2Mk_3qCEUGNs1ynnoqiG2Q_ftaZ_-Fg'
);

async function main() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log(data, error);
}

main();
