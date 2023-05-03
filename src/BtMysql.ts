'use strict';

import Mysql from 'mysql2/promise';
import { BtMysqlConnection } from './BtMysqlConnection';
import { BtMysqlConnectionPool } from './BtMysqlConnectionPool';

//MySQL2 not supporting Pool Cluster
//import { ClusterSelector, BtMysqlPoolCluster} from "./BtMysqlPoolCluster";

export class BtMysql {
    constructor () {}

    static async buildConnection(config: any) :Promise<BtMysqlConnection> {
        try {
            const connection = await Mysql.createConnection(config);
            await connection.connect();
            return new BtMysqlConnection(connection);
        } catch (exception) {
            throw exception;
        }
    }

    static async buildConnectionPool(config:any, showPoolState :boolean = false):Promise<BtMysqlConnectionPool> {
        try {
            const connectionPool = await Mysql.createPool(config);
            //console.log('CONNECTION POOL:', connectionPool);
            return new BtMysqlConnectionPool(connectionPool, showPoolState);

        } catch (exception) {
            throw exception;
        }
    }

    /*
    static async buildClusterPool( configList:Record<string, any>,
                                   showPoolState: boolean = false,
                                   selector?: ClusterSelector): Promise<BtMysqlPoolCluster> {
        try {

            let poolCluster = null;
            if (selector) {
                poolCluster = await Mysql.createPoolCluster({defaultSelector:selector});
            } else {
                poolCluster = await Mysql.createPoolCluster({defaultSelector:ClusterSelector.order});
            }

            if (typeof configList === 'object') {
                for (let [name, config] of Object.entries(configList)) {
                    //console.log('CONFIG:', name, config);
                    poolCluster.add(name, config);
                }
            } else {
                poolCluster.add(configList);
            }

            return new BtMysqlPoolCluster(poolCluster, showPoolState, selector );

        } catch (exception) {
            throw exception;
        }
    }
     */
}

export * from './BtMysqlData';
export { BtMysqlConnectionPool } from './BtMysqlConnectionPool';
export { BtMysqlConnection } from './BtMysqlConnection';
export { BtMysqlAbstractDao } from './BtMysqlAbstractDao';
