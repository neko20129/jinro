const SUPABASE_URL = 'https://fzgvfhxooshlwiumvfow.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Z3ZmaHhvb3NobHdpdW12Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTAzOTksImV4cCI6MjEwNDI4NjM5OX0.SsSY9_6TQLicAAW--08B1IVtfXYEVZCTz-WeUdg-Uq4';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//送信用関数
async function insertData(tableName, dataObject) {
    const { data, error } = await supabaseClient
        .from(tableName)
        .insert([dataObject]);

    if (error) {
        console.error(`[${tableName}] への保存エラー:`, error);
        return false;
    }
    return true;
}

//送信呼び出し用
async function handleSend(tableName, data) {
    const success = await insertData(tableName, data);

    if (success) {
        alert('メッセージを送信しました');
    }
}

//受信用関数
async function fetchData(tableName) {
    const { data, error } = await supabaseClient
        .from(tableName) 
        .select('*');

    if (error) {
        console.error(`[${tableName}] からの取得エラー:`, error);    
        return null;
    }

    return data;
}