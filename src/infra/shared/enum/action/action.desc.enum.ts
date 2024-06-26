enum ActionDescEnum {
  user_create = 'Создал пользователя',
  user_delete = 'Удалил пользователя',
  user_update = 'Отредактировал пользователя',
  partiya_create = 'Создал новую партию!',
  partiya_update = 'Партия завершена!',
  update_partiya = 'Изменил расход партии.',
  partiya_send = 'Партия завершена!',
  transfer_create = 'Сделал трансфер.',
  transfer_accept = 'Кассир принял трансфер.',
  transfer_reject = 'Кассир не принял трансфер.',
  excel = 'Импортировано из файла Excel',
  close_kassa = 'Закрыл кассу в размере',
  add_income_cashflow_boss = 'Добавил Бос приход в размере',
  add_income_cashflow_shop = 'Добавил Магазин приход в размере',
  add_expense_cashflow_boss = 'Добавил Бос расход в размере',
  add_expense_cashflow_shop = 'Добавил Магазин расход в размере',
  accept_order = 'Подтвердил продажу.',
  return_order = 'Принял возврат товара',
  reject_order = 'Отменил продажу товара',
}

export default ActionDescEnum;
