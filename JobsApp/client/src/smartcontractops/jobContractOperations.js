import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2'
import {JsonRpc, Api} from 'eosjs';
import network from '../config/eosConfig'

export const createJobContract = (jobId, employer, employee) => {



};

export const issueTokens = (_to, _quantity) => {

    let account = null;
    let scatter = null;
    let contractAccount = 'saraniyascat';
    let rpc = null;
    let eos = null;
    const authority = "active";

    const networkVal = ScatterJS.Network.fromJson(network);

    const requiredFields = {
        accounts: [networkVal]
    };

    ScatterJS.plugins(new ScatterEOS());

    ScatterJS.scatter
    .connect(contractAccount)
    .then(connected => {
        
        scatter = ScatterJS.scatter;
        scatter.getIdentity(requiredFields).then(() => {
            /// get identity
            account = scatter.identity.accounts.find(x=> x.blockchain==='eos');
            rpc = new JsonRpc(networkVal.fullhost());
            eos = scatter.eos(networkVal, Api, { rpc });

            // do the transaction here
            window.ScatterJS = null;

            const action = "issue";
            //{ amount: _quantity, symbol: "WRK"}
            var quantityVal = _quantity.toString() + " WRK";
            const data = {to : _to, quantity: quantityVal};
            return eos.transact({
                actions: [
                    {
                        account: contractAccount,
                        name: action,
                        authorization: [
                            {
                                actor: contractAccount,
                                permission: authority
                            }
                        ],
                        data: {
                            ...data
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30
            });

        }).catch(err => {
            var response = { error: err };
            alert(JSON.stringify(response));
            return response;
        });
        
    });
};


export const acceptJob = (jobId, employee) => {
    


};

export const checkInWork = (jobId, employee, date) => {
    
    

};

export const getTokens = (jobId, employee, date) => {
    
    

};