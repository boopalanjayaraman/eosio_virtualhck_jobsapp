import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2'
import {JsonRpc, Api} from 'eosjs';
import network from '../config/eosConfig'

ScatterJS.plugins(new ScatterEOS());

let scatter = null, userAccount = null, userEosConnection = null;

export const connectToScatter = appName => (new Promise((resolve, reject)=> {
    ScatterJS.scatter.connect(appName).then(connected => {
        const
            onSuccess = () => {
                scatter = ScatterJS.scatter;
                resolve();
            },
            onError = () => reject({
                message: "Scatter not found. Please install and unlock scatter"
            });

        connected ? onSuccess() : onError();
    });
}));

export const loginToScatter = ()=> {
    const networkVal = ScatterJS.Network.fromJson(network);
    const requiredFields = { accounts:[networkVal] };
    return scatter.getIdentity(requiredFields).then(() => {
        userAccount = scatter.identity.accounts.find(x => x.blockchain === 'eos');

        console.log(userAccount);
        console.log(networkVal.fullhost());
        // Set expiration time for eos connection, can have more options
        const rpc = new JsonRpc(networkVal.fullhost());
        const eosOptions = { expireInSeconds: 60 };
        
        userEosConnection = scatter.eos(networkVal, Api, {rpc});

        return {
            name: userAccount.name,
            authority: userAccount.authority,
            publicKey: userAccount.publicKey
        };
         
    }).catch(err => {
        console.log(err);
        logout();
    });
};

export const logout = () => {
    scatter.logout();
};