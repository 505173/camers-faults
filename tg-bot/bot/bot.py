import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
USERS_FILE = "/data/users.txt"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def add_user(user_id: int):
    if not os.path.exists(USERS_FILE):
        open(USERS_FILE, "a").close()
    with open(USERS_FILE, "r") as f:
        if str(user_id) in [line.strip() for line in f]:
            return
    with open(USERS_FILE, "a") as f:
        f.write(f"{user_id}\n")

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    add_user(message.from_user.id)
    await message.answer("✅ Бот работает и подписан на уведомления!")

if __name__ == "__main__":
    asyncio.run(dp.start_polling(bot))
