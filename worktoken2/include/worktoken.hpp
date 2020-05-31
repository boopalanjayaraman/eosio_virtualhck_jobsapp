#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>


using namespace std;
using namespace eosio;


CONTRACT worktoken : public contract {
  public:
    using contract::contract;
    worktoken( name receiver, name code, datastream<const char*> ds )
         : contract(receiver, code, ds), _accounts(receiver, receiver.value) {}

    ACTION transfer(name from, name to, asset quantity);
    ACTION issue(name to, asset quantity);

  private:
    TABLE accounts {
      name   owner;
      asset  balance;
      auto primary_key() const { return owner.value; }
    };
    typedef multi_index<name("accounts"), accounts> accounts_table;

    accounts_table _accounts;
    
};
