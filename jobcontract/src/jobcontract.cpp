#include <jobcontract.hpp>

static constexpr symbol token_symbol = symbol(symbol_code("WRK"), 4); 

ACTION jobcontract::create(name employer, name employee, uint64_t jobId, int8_t jobType){
  require_auth(employer);
  check(employer != employee, "Employer and Employee/Contractor cannot be same.");
  check(valid_job_type(jobType), "Invalid Job Type.");
  check(!valid_job_id(jobId), "Job already exists.");
  check(is_account(employee), "Employee/Contractor should be a valid account.");

  // add the job contract
  _jobs.emplace(get_self(), [&](auto& job){
      job.employer = employer;
      job.employee = employee;
      job.id = jobId;
      job.jobType = jobType;
      job.status = CREATED;
    });
  
  // addToMyJobs as employer
  add_to_my_jobs(employer, jobId, true);
  // add a checkin or progress entry
  add_to_checkins_or_progress(jobId, jobType);
}

// validating jobType
bool jobcontract::valid_job_type(int8_t jobType){
  return jobType == FULL_TIME ||
        jobType == PART_TIME ||
        jobType == SERVICES ||
        jobType == CONSULTING;
}

// check if job exists
bool jobcontract::valid_job_id(uint64_t jobId){
  auto job_itr = _jobs.find(jobId);
  if(job_itr == _jobs.end()){
      return false;
    }
  return true;
}

// validate the employer of a job
bool jobcontract::is_employer(uint64_t jobId, name user){
  auto job_itr = _jobs.find(jobId);
  if(job_itr == _jobs.end()){
      return false;
  }
  else{
    return job_itr->employer == user;
  }
}

// validate the employer of a job
bool jobcontract::is_employee_or_contractor(uint64_t jobId, name user){
  auto job_itr = _jobs.find(jobId);
  if(job_itr == _jobs.end()){
      return false;
  }
  else{
    return job_itr->employee == user;
  }
}

// add to my jobs (userjobs) reverse look up
void jobcontract::add_to_my_jobs(name user, uint64_t jobId, bool createdJob){
  auto user_job_itr = _userjobs.find(user.value);
  if(user_job_itr == _userjobs.end()){
      // emplace the userjob
      _userjobs.emplace(get_self(), [&](auto& userjob){
        userjob.user = user;
        if(createdJob){
          userjob.createdjobs.push_back(jobId);
        }
        else{
          userjob.employedjobs.push_back(jobId);
        }
      });
    }
    else{
      // modify the userjob
      _userjobs.modify(user_job_itr, user, [&](auto& userjob) {
        if(createdJob){
          userjob.createdjobs.push_back(jobId);
        }
        else{
          userjob.employedjobs.push_back(jobId);
        }
      });
    }
}

//add to checkins / progresses
void jobcontract::add_to_checkins_or_progress(uint64_t job_id, int8_t jobtype){
  if(is_employment_jobtype(jobtype)){
    // add checkin record
    auto checkin_itr = _checkins.find(job_id);
    if(checkin_itr == _checkins.end()){
      // emplace the checkin record
      _checkins.emplace(get_self(), [&](auto& checkin){
        checkin.jobId = job_id;
      });
    }
  }
  else if(is_services_jobtype(jobtype)){
    // add progress record
    auto workprogress_itr = _workprogress.find(job_id);
    if(workprogress_itr == _workprogress.end()){
      // emplace the workprogress record
      _workprogress.emplace(get_self(), [&](auto& workprogress){
        workprogress.jobId = job_id;
      });
    }
  }
}

//updating timeline of jobs
ACTION jobcontract::settimeline(uint64_t jobId, int32_t startDate, int32_t endDate, double initAdvance){
  check(startDate < endDate, "StartDate cannot be greater than EndDate, or cannot be same.");
  check(startDate >= now(), "StartDate cannot be in the past.");
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of owner
  require_auth(job_itr->employer);
  // check the status of job contract. Can be updated only until it becomes active.
  check(job_itr->status == CREATED || job_itr->status == READY, "Can update job contracts with CREATED / READY statuses only.");

  _jobs.modify(job_itr, job_itr->employer, [&](auto& job) {
     job.startDate = startDate;
     job.endDate = endDate;
     job.initAdvance = initAdvance;
     // check if we can mark the status as ready.
     if(is_job_contract_ready(job.id, job.startDate, job.endDate, job.jobType)){
        job.status = READY;
     }
  });


}

// determining if a contract is in ready state (with essential fields filled)
bool jobcontract::is_job_contract_ready(uint64_t job_id, int32_t start_date, int32_t end_date, int8_t job_type){
  bool hasRequiredFields = start_date != 0 &&
                        end_date != 0;
  bool hasOtherFields = false;
  //check if it is employment jobtype or services job type
  if(is_employment_jobtype(job_type)){
    auto checkin_itr = _checkins.find(job_id);
    if(checkin_itr->location != "" &&
        checkin_itr->perDaySalary != 0 &&
        checkin_itr->paymentFrequency != 0){
          hasOtherFields = true;
    }
  }
  else if(is_services_jobtype(job_type)){
    auto workprogress_itr = _workprogress.find(job_id);
    if(workprogress_itr->value != 0 &&
        (workprogress_itr->paymentMilestones).size() != 0){
          hasOtherFields = true;
    }
  }
  return hasRequiredFields && hasOtherFields;
}

// checking if jobtype is employment category
bool jobcontract::is_employment_jobtype(int8_t jobtype){
  return jobtype == FULL_TIME || jobtype == PART_TIME;
}

// checking if jobtype is services category
bool jobcontract::is_services_jobtype(int8_t jobtype){
  return jobtype == CONSULTING || jobtype == SERVICES;
}



// update employment terms - for employment type jobs
ACTION jobcontract::setempterms(uint64_t jobId, string location, int16_t perDaySalary, int16_t paymentFrequency){
  check(perDaySalary > 0, "perDaySalary should be greater than 0.");
  check(paymentFrequency > 0, "paymentFrequency should be greater than 0. [1-Daily, 7-Weekly, 30-Monthly]");
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of owner
  require_auth(job_itr->employer);
  // check the status of job contract. Can be updated only until it becomes active.
  check(job_itr->status == CREATED || job_itr->status == READY, "Can update job contracts with CREATED / READY statuses only.");

  auto checkin_itr = _checkins.find(jobId);
  _checkins.modify(checkin_itr, job_itr->employer, [&](auto& checkin) {
     checkin.location = location;
     checkin.perDaySalary = perDaySalary;
     checkin.paymentFrequency = paymentFrequency;
  });
}

// update services job terms - for services type jobs
ACTION jobcontract::setserterms(uint64_t jobId, double value, vector<int8_t> paymentMilestones){
  check(value > 0, "Value should be greater than 0.");
  check(paymentMilestones.size() > 0, "paymentMilestones cannot be empty.");
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of owner
  require_auth(job_itr->employer);
  // check the status of job contract. Can be updated only until it becomes active.
  check(job_itr->status == CREATED || job_itr->status == READY, "Can update job contracts with CREATED / READY statuses only.");

  auto workprogress_itr = _workprogress.find(jobId);
  _workprogress.modify(workprogress_itr, job_itr->employer, [&](auto& _progress) {
     _progress.value = value;
     _progress.paymentMilestones = paymentMilestones;
  });

}

// Employee accepting a job. This should mark the status of the contract to active.
ACTION jobcontract::acceptjob(uint64_t jobId){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employee
  require_auth(job_itr->employee);

  // saving the accepted flag.
  _jobs.modify(job_itr, job_itr->employee, [&](auto& job) {
     job.status = ACTIVE;
     job.accepted = true;
  });
}

//employee checking in for work (through a device / app)
ACTION jobcontract::checkinwork(uint64_t jobId, int32_t date, double units){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employee
  require_auth(job_itr->employee);
  check(job_itr->status == ACTIVE, "Cannot check-in for work on a non-Active work contract.");
  check(job_itr->startDate < date, "Cannot check-in for work for past dates.");
  check(job_itr->endDate >= date, "Cannot check-in for work for future dates.");
  check(units >= 0 && units <=1, "units should be between 0 - 1 on a given day.");

  // add work check-in
  auto checkin_itr = _checkins.find(jobId);
  _checkins.modify(checkin_itr, job_itr->employee, [&](auto& checkin) {
     timesheet _timesheet = {date, units, checkin.perDaySalary, false };
     // go through existing pending timesheets and see if this date is available
     bool exists = false;
     auto ts = checkin.timesheets;
     for (auto vec = ts.begin(); vec != ts.end(); vec++) {
        if(vec->date == date){
          check(!(vec->approved), "Cannot change a timesheet for a date that already exists and is approved.");
          ts.erase(vec);
          ts.insert(vec, _timesheet);
          exists = true;
          break;
        }
     }
     if(!exists){
      checkin.timesheets.push_back(_timesheet);
      }
  });

}

//contractor recording progress for work (through a device / app)
ACTION jobcontract::setprogress(uint64_t jobId, int32_t date, int8_t progressVal){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employee
  require_auth(job_itr->employee);
  check(job_itr->status == ACTIVE, "Cannot set progress for work on a non-Active work contract.");
  check(job_itr->startDate < date, "Cannot set progress for work for past dates.");
  check(job_itr->endDate >= date, "Cannot set progress for work for future dates.");
  check(progressVal >= 1 && progressVal <=100, "progress should be between 1 - 100 on a given day.");

  // record progress
  auto workprogress_itr = _workprogress.find(jobId);
  _workprogress.modify(workprogress_itr, job_itr->employee, [&](auto& _workprogress) {
      progress _newprogress = {date, progressVal, false };
      // go through existing pending progresses and see if this progress entry is valid
      auto lastProgress = _workprogress.progresses.back();
      check(lastProgress.progressVal < progressVal, "Progress cannot go down.");
     _workprogress.progresses.push_back(_newprogress);
  });
}

// employer approving pending checkins (timesheet entries).
// TOKENS in proportion to the approved work will get transferred from employer to employee account balance.
// checkins will be cleared / (can be kept) for next cycle after approval 
ACTION jobcontract::apprcheckins(uint64_t jobId){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employer
  require_auth(job_itr->employer);
  check(job_itr->status == ACTIVE, "Cannot approve checkins on a non-Active work contract.");

  //calculate tokens to move
  auto token = 0;
  auto checkin_itr = _checkins.find(jobId);
  auto ts = checkin_itr->timesheets;
  for (auto vec = ts.begin(); vec != ts.end(); vec++) {
    token += (vec->dayUnit) * (vec->perDaySalary);
  }
  //transfer tokens
  asset tosend;
  tosend.amount = token;
  tosend.symbol = token_symbol;
  transfer(job_itr->employer, job_itr->employee, tosend);
  // clear the checkins 
  _checkins.modify(checkin_itr, job_itr->employer, [&](auto& checkin) {
     // clear checkins for past cycle after approval
     checkin.timesheets.clear();
  });
}

// employer approving progress for a consulting or services job.
// calculates token and credits to contractor as per set definitions
ACTION jobcontract::apprprogress(uint64_t jobId){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employer
  require_auth(job_itr->employer);
  check(job_itr->status == ACTIVE, "Cannot approve checkins on a non-Active work contract.");

  auto token = 0;
  auto workprogress_itr = _workprogress.find(jobId);
  auto pr = workprogress_itr->progresses;
  // get the last approved progress & calculate tokens
  auto lastApprovedProgress = 0;
  for (auto vec = pr.begin(); vec != pr.end(); vec++) {
      if(vec->approved && vec->progressVal > lastApprovedProgress){
        lastApprovedProgress = vec->progressVal;
      }
    }
  auto currentLastProgress = pr.back().progressVal;
  token = (currentLastProgress - lastApprovedProgress) * (workprogress_itr->value / 100);
  
  // approve the other progress records
  _workprogress.modify(workprogress_itr, job_itr->employer, [&](auto& _workprogress) {
    auto pr = _workprogress.progresses;
    for (auto vec = pr.begin(); vec != pr.end(); vec++) {
      if(!vec->approved){
        vec->approved = true;
      }
    }
  });

  //transfer tokens
  asset tosend;
  tosend.amount = token;
  tosend.symbol = token_symbol;
  transfer(job_itr->employer, job_itr->employee, tosend);
}

// terminate called by employer
ACTION jobcontract::terminate(uint64_t jobId){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employer
  require_auth(job_itr->employer);
  check(job_itr->status != TERMINATED && job_itr->status != CLOSED  , "Can only terminate a open work contract.");
  // add logic here in future for handling termination penalty / agreeing mechanism between parties, in case of active contract 
  _jobs.modify(job_itr, job_itr->employer, [&](auto& job) {
     job.status = TERMINATED;
  });
}

// leave contract - is an action initiated by employee
ACTION jobcontract::leave(uint64_t jobId){
  check(valid_job_id(jobId), "Job does not exist.");
  // fetch the job
  auto job_itr = _jobs.find(jobId);
  // require auth of employer
  require_auth(job_itr->employee);
  check(job_itr->status != TERMINATED && job_itr->status != CLOSED  , "Can only terminate a open work contract.");
  // add logic here in future for handling termination penalty / agreeing mechanism between parties, in case of active contract 
  _jobs.modify(job_itr, job_itr->employee, [&](auto& job) {
     job.status = TERMINATED;
  });
}



ACTION jobcontract::transfer(name from, name to, asset quantity) {
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

ACTION jobcontract::issue(name to, asset quantity) {
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

EOSIO_DISPATCH(jobcontract, (create)(settimeline)(setempterms)(setserterms)(acceptjob)(checkinwork)(setprogress)(apprcheckins)(apprprogress)(terminate)(leave)(transfer)(issue))
