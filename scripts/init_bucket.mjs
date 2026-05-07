import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cagaxhhtizrfmhtvlkps.supabase.co';
const supabaseServiceRoleKey = 'sb_secret_SYffWUHhZlRHbMgQAMTC1g_lZi7rSkJ';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function initBucket() {
    console.log("Checking bucket 'catalogos'...");
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
        console.error("Error listing buckets:", listError);
        return;
    }
    
    const exists = buckets.find(b => b.name === 'catalogos');
    
    if (!exists) {
        console.log("Bucket 'catalogos' does not exist. Creating it...");
        const { data, error } = await supabase.storage.createBucket('catalogos', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });
        
        if (error) {
            console.error("Failed to create bucket:", error);
        } else {
            console.log("Successfully created bucket 'catalogos'!");
        }
    } else {
        console.log("Bucket 'catalogos' already exists.");
        
        // Ensure it's public
        const { data, error } = await supabase.storage.updateBucket('catalogos', {
            public: true
        });
        if (error) {
            console.error("Failed to update bucket to public:", error);
        } else {
            console.log("Bucket is set to public.");
        }
    }
}

initBucket();
