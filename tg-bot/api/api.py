import os
from fastapi import FastAPI, Request
from aiogram import Bot
import asyncio

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
USERS_FILE = "/data/users.txt"

bot = Bot(token=BOT_TOKEN)
app = FastAPI()

def get_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return [line.strip() for line in f.readlines()]

@app.post("/notify")
async def notify(request: Request):
    data = await request.json()
    message = data.get("message", "Новое уведомление!")

    users = get_users()
    for user_id in users:
        try:
            await bot.send_message(user_id, f"📢 {message}")
        except Exception as e:
            print(f"Ошибка при отправке {user_id}: {e}")
    return {"status": "ok", "sent_to": len(users)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
