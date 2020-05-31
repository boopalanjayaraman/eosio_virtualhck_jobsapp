#include <worktoken.hpp>

static constexpr symbol token_symbol = symbol(symbol_code("WRK"), 4); 

ACTION worktoken::transfer(name from, name to, asset quantity) {
  require_auth(from);
  check(quantity.symbol == token_symbol, "Invalid / incorrect symbol.");

  //accounts_table _accounts(get_self(), get_self().value);
  
  // Find the account from _accounts table
  auto fromacc_itr = _accounts.find(from.value);
  check(fromacc_itr != _accounts.end(), "Payer Account unavailable / Not issued tokens.");
  // check the accounts balance and quantity
  check(fromacc_itr->balance >= quantity, "Inadequate balance");

  // subtract the balance in payer's account
  _accounts.modify(fromacc_itr, from, [&](auto& account) {
    account.balance = account.balance - quantity;
  });
  // add the balance in receiver's account
  auto to_acc_itr = _accounts.find(to.value);
  if(to_acc_itr == _accounts.end()){
    // add the account if it does not exist in the table
    //self (contract account) is the payer
    _accounts.emplace(get_self(), [&](auto& account){
      account.owner = to;
      account.balance = quantity;
    });
  }
  else{
    // modify the receiver account to new balance
    _accounts.modify(to_acc_itr, to, [&](auto& account) {
      account.balance = account.balance + quantity;
    });
  }
  
}

ACTION worktoken::issue(name to, asset quantity) {
  require_auth(get_self());
  check(quantity.symbol == token_symbol, "Invalid / incorrect symbol.");

  //accounts_table _accounts(get_self(), get_self().value);

  auto to_acc_itr = _accounts.find(to.value);
  if(to_acc_itr == _accounts.end()){
    // add the account if it does not exist in the table
    //self (contract account) is the payer
    _accounts.emplace(get_self(), [&](auto& account){
      account.owner = to;
      account.balance = quantity;
    });
  }
  else{
    // modify the receiver account to new balance
    _accounts.modify(to_acc_itr, to, [&](auto& account) {
      account.balance = account.balance + quantity;
    });
  }
}

EOSIO_DISPATCH(worktoken, (transfer)(issue))
