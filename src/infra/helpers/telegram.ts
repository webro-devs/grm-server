import { Telegraf } from 'telegraf';

const token = process.env.BOT_TOKEN;
const app = new Telegraf(token, {});

const telegram = async ({
  imgUrl,
  model,
  color,
  size,
  shape,
  style,
  price
}) => {
  const chatId = process.env.CHATID;
  console.log(chatId);
  const shapes = {
    rectangle: 'Прямоугольный',
    rulo: 'Метражный',
    oval: 'Овальный',
    daire: 'Круглый',
  };
  const text = `
✨ Самые красивые и уютные ковры ✨

📐 Размер: ${size}
💎 Коллекция: ${model.collection.title}
🎨 Цвет: ${color.title}
🏷️ Модель: ${model.title}
🔲 Форма: ${shapes[shape?.toLowerCase()]}
🖼️ Стиль: ${style}

💰 Цена: ${price}-сум  

🛒 Широкий ассортимент ковров в онлайн магазине Gilamshop.uz

📞 Телефон: +998 (99) 761-11-11
🌐 Сайт: gilamshop.uz
📷 Instagram: @gilamshop_insta`;

  imgUrl &&
    (await app.telegram.sendPhoto(
      -1001922756052,
      {
        url: imgUrl,
      },
      {
        caption: text,
        parse_mode: 'HTML',
      },
    ));

  if (!imgUrl) await app.telegram.sendMessage(-1001922756052, text, { parse_mode: 'HTML' });
  console.log("sent telegram!");
};

export default telegram;
