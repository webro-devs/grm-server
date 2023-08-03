import { Telegraf } from 'telegraf';

const token = process.env.BOT_TOKEN;
const app = new Telegraf(token);

const telegram = async ({ imgUrl, model, color, size, shape }) => {
  const chatId = process.env.CLIENT_ID;
  const text = `😍 Наши необычные ковры добавят интерьеру цвета, характер и современности вашего дома !)

  🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸

  model: ${model}🧮
  color: ${color}💈
  size: ${size}📐
  Shape: ${shape}

  🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸
  
  😍 Bizning Sanat Hali gilamlari sizning uyingizga rang, xarakter va zamonaviylikni qo'shadi !)
  
  📍Адрес: Улица Лабзак 103.
  📌Ориентир: Колледж связи. 
  🕙 Время работы с 09:00 до 20:00
  📲 +99898-800-00-09.
  ☎️ +99897-490-55-55.
  
  Telegram Chat: 🔵@SanatHali_Labzak`;

  await app.telegram.sendPhoto(
    chatId,
    {
      url: imgUrl,
    },
    {
      caption: text,
      parse_mode: 'HTML',
    },
  );
};

export default telegram;
