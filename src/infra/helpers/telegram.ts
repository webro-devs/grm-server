import { Telegraf } from 'telegraf';

const token = process.env.BOT_TOKEN;
const app = new Telegraf(token);

const telegram = async ({
  imgUrl,
  model,
  color,
  size,
  shape,
  phone1,
  phone2,
  address,
  addressLink,
  title,
  endWork,
  startWork,
  landmark,
}) => {
  const chatId = process.env.CLIENT_ID;
  const text = `😍 Наши необычные ковры добавят интерьеру цвета, характер и современности вашего дома !)

  🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸

  Модель: ${model}🧮
  Цвет: ${color}💈
  Размер: ${size}📐
  Форма: ${shape}

  🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸
  
  😍 Наши ковры ${title} добавят цвет, характер и современность в ваш дом!)
  📌 Имя филиала: ${title}. 
  📍 Адрес: <a href='${addressLink}'>${address}</a>.
  📌 Ориентир: ${landmark}.

  🕙 Время работы с ${startWork} до ${endWork}
  📲 ${phone1}.
  ☎️ ${phone2}.
  
  🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸`;

  imgUrl &&
    (await app.telegram.sendPhoto(
      chatId,
      {
        url: imgUrl,
      },
      {
        caption: text,
        parse_mode: 'HTML',
      },
    ));

  if (!imgUrl) app.telegram.sendMessage(chatId, text, { parse_mode: 'HTML' });
};

export default telegram;
