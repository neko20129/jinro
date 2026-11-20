const SUPABASE_URL = 'https://fzgvfhxooshlwiumvfow.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Z3ZmaHhvb3NobHdpdW12Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTAzOTksImV4cCI6MjEwNDI4NjM5OX0.SsSY9_6TQLicAAW--08B1IVtfXYEVZCTz-WeUdg-Uq4';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//送信用関数
async function insertData(tableName, data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        console.error(`[${tableName}] に送信するデータがオブジェクトではありません:`, data);
        return false;
    }

    const query = supabaseClient.from(tableName);
    const { error } = tableName === 'players' && data.player_id != null
        ? await query.upsert(data, { onConflict: 'player_id' })
        : await query.insert(data);

    if (error) {
        console.error(`[${tableName}] への保存エラー:`, error);
        return false;
    }
    return true;
}

async function savePlayerState(player) {
    const { error } = await supabaseClient
        .from('players')
        .upsert(player, { onConflict: 'player_id' });

    if (error) {
        console.error('[players] への保存エラー:', error);
        return false;
    }
    return true;
}

//取得用関数
async function fetchData(tableName, rowId = null) {
    let query = supabaseClient
        .from(tableName)
        .select('*');

    if (rowId !== null) {
        query = query.eq('id', rowId);
    }

    const { data, error } = await query;

    if (error) {
        console.error(`[${tableName}] の取得エラー:`, error);
        return [];
    }
    return data ?? [];
}

async function handleSend(tableName, data) {
    return insertData(tableName, data);
}

//リセット
function resetStorage(s) {
    if (!s) return localStorage.clear();
    localStorage.removeItem(s); 
}