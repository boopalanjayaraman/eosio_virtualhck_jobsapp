#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
#include <vector>

using namespace std;
using namespace eosio;

CONTRACT jobcontract : public contract {
  public:
    using contract::contract;
    jobcontract( name receiver, name code, datastream<const char*> ds )
         : contract(receiver, code, ds), _accounts(receiver, receiver.value), 
         _userjobs(receiver, receiver.value), _jobs(receiver, receiver.value),
         _checkins(receiver, receiver.value), _workprogress(receiver, receiver.value) {}
    
    // job related actions
    ACTION create(name employer, name employee, uint64_t jobId, int8_t jobType);
    ACTION settimeline(uint64_t jobId, int32_t startDate, int32_t endDate, double initAdvance);
    ACTION setempterms(uint64_t jobId, string location, int16_t perDaySalary, int16_t paymentFrequency);
    ACTION setserterms(uint64_t jobId, double value, vector<int8_t> paymentMilestones);
    ACTION acceptjob(uint64_t jobId);
    ACTION checkinwork(uint64_t jobId, int32_t date, double units);
    ACTION setprogress(uint64_t jobId, int32_t date, int8_t progress);
    ACTION apprcheckins(uint64_t jobId);
    ACTION apprprogress(uint64_t jobId);
    ACTION terminate(uint64_t jobId); // by employer
    ACTION leave(uint64_t jobId); // by employee / contractor

    // token related actions
    ACTION transfer(name from, name to, asset quantity);
    ACTION issue(name to, asset quantity);

  private:
    
    enum contract_status: int8_t  {
      CREATED = 0, // just after creating
      READY = 1, // after updating fields
      ACTIVE   = 2, // after employee accepts
      TERMINATED  = 3, // if either party terminates
      CLOSED = 4 // if contract period ends normally
    };

    enum job_type: int8_t  {
      FULL_TIME     = 0,
      PART_TIME   = 1,  
      SERVICES  = 2,  
      CONSULTING = 3  
    };

    // jobs related tables
    TABLE userjobs {
      name user;
      vector<uint64_t> employedjobs;
      vector<uint64_t> createdjobs;
      auto primary_key() const { return user.value; }
    };
    typedef multi_index<name("userjobs"), userjobs> userjobs_table;

    userjobs_table _userjobs;

    TABLE jobs {
      uint64_t id;
      name employer;
      name employee;
      int32_t startDate = 0;
      int32_t endDate = 0;
      double initAdvance = 0;
      double advanceToSubtract = 0;
      double totalPaidSum = 0;
      int8_t status;
      int8_t jobType;
      bool accepted = false;
      auto primary_key() const { return id; }
    };
    typedef multi_index<name("jobs"), jobs> jobs_table;

    jobs_table _jobs;

    //checkins - attendance / timesheet - for fulltime / parttime jobs 
    struct timesheet{
      int32_t date;
      double dayUnit;
      int16_t perDaySalary;
    };

    TABLE checkins {
      uint64_t jobId;
      string location = "";
      int16_t perDaySalary = 0;
      int8_t paymentFrequency = 0;
      vector<timesheet> timesheets;
      auto primary_key() const { return jobId; }
    };
    typedef multi_index<name("checkins"), checkins> checkins_table;

    checkins_table _checkins;

    //progress  - milestones
    struct progress{
      int32_t date;
      int8_t progress;
      bool approved;
    };

    TABLE workprogress {
      uint64_t jobId;
      double value = 0;
      vector<int8_t> paymentMilestones;
      vector<progress> progresses;
      auto primary_key() const { return jobId; }
    };
    typedef multi_index<name("workprogress"), workprogress> workprogress_table; 

    workprogress_table _workprogress;

    // token related tables
    TABLE accounts {
      name  owner;
      asset  balance;
      auto primary_key() const { return owner.value; }
    };
    typedef multi_index<name("accounts"), accounts> accounts_table;

    accounts_table _accounts;

    // private member functions
    bool valid_job_type(int8_t jobtype);
    bool valid_job_id(uint64_t job_id);
    bool is_employer(uint64_t job_id, name user);
    bool is_employee_or_contractor(uint64_t job_id, name user);
    void add_to_my_jobs(name user, uint64_t job_id, bool created_job);
    void add_to_checkins_or_progress(uint64_t job_id, int8_t jobtype);
    bool is_job_contract_ready(uint64_t job_id, int32_t start_date, int32_t end_date, int8_t job_type);
    bool is_employment_jobtype(int8_t jobtype);
    bool is_services_jobtype(int8_t jobtype);

    // getting time
    uint32_t now() {
      return (uint32_t)(current_time_point().sec_since_epoch());
    }
};
