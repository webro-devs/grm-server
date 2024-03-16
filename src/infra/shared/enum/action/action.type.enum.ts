enum ActionTypeEnum {
  user_create = 'user create',
  user_delete = 'user delete',
  user_update = 'user updete',
  partiya_create = 'create partiya',
  partiya_update = 'update partiya',
  update_partiya = 'update partiya',
  partiya_send = 'end partiya',
  transfer_create = 'transfer',
  transfer_accept = 'transfer',
  transfer_reject = 'transfer',
  excel = 'excel',
  close_kassa = 'close kassa',
  add_income_cashflow_boss = 'cashflow',
  add_income_cashflow_shop = 'cashflow',
  add_expense_cashflow_boss = 'cashflow',
  add_expense_cashflow_shop = 'cashflow',
  accept_order = 'order',
  return_order = 'order',
  reject_order = 'order',
}

export default ActionTypeEnum;
