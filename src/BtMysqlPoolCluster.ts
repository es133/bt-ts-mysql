'use strict';

import {PoolCluster} from "mysql2";
import PoolConnection from "mysql2/typings/mysql/lib/PoolConnection";

//NOT USING NOW
export enum ClusterSelector {
    order = 'ORDER',
    roundrobin ='RR',
    random= 'RANDOM'
}

export class BtMysqlPoolCluster {

    protected clusterSelector: ClusterSelector = ClusterSelector.order;
    protected poolCluster?: PoolCluster;

    constructor(poolCluster: PoolCluster, showPoolState: boolean = false, selector?: ClusterSelector) {

        if (!poolCluster) {
            console.error('Invalid pool cluster');
            return;
        }

        this.poolCluster = poolCluster;
        if (selector) {
            this.clusterSelector = selector;
        }

        if (showPoolState) {
            this.poolCluster.on('remove', (nodeId) => {
                console.log('REMOVED NODE : ' + nodeId);
            });
            this.poolCluster.on('connection', (connection) => {
                console.log('CONNECTED NODE : ', connection['threadId']);
            });
        }
    }

    getPoolCluster():PoolCluster | null {
        try {
            if (this.poolCluster) {
                return this.poolCluster;
            } else {
                return null;
            }

        } catch (exception) {
            throw exception;
        }
    }

    protected async getConnectionPool(poolName: string | null = null):Promise<PoolConnection> {

        return new Promise((resolve, reject) => {
            if (this.poolCluster) {
                if (poolName) {
                    console.log('POOL CLUSTER:', this.poolCluster);

                    this.poolCluster.getConnection(poolName, (error, connection) => {

                        console.log('get CONNECTION:', connection);
                        if (error) {
                            console.error('POOL CLUSTER GET CONNECTION ERROR', error);
                            reject(null);
                        } else {
                            resolve(connection);
                        }
                    });
                } else {
                    this.poolCluster.getConnection((error, connection) => {
                        if (error) {
                            console.error('POOL CLUSTER GET CONNECTION ERROR', error);
                            reject(null);
                        } else {
                            resolve(connection);
                        }
                    });
                }
            }
        });

    }

    async execute(query:string, value:any, poolName:string | null = null):Promise<any> {

        try {

            const poolConnection = await this.getConnectionPool(poolName);
            console.log('CONNECTION:', poolConnection);
            return new Promise((resolve, reject) => {
                poolConnection.query(query, value, (error, result)=>{
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });

        } catch (exception) {
            console.log("DB Error", exception);
            console.error("QUERY: ", query);
            console.error("PARAMS: ", value);
            return Promise.reject(exception);
        }
    }
}
