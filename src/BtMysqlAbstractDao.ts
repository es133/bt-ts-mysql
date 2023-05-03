'use strict';

import {BtMysqlConnection} from "./BtMysqlConnection";
import {BtMysqlData, BtMysqlDataConstructor, BtMysqlModifyResult} from './BtMysqlData';
import {BtMysqlConnectionPool} from "./BtMysqlConnectionPool";

export class BtMysqlAbstractDao {

    protected client: BtMysqlConnection | BtMysqlConnectionPool | null;

    constructor (connector: BtMysqlConnection | BtMysqlConnectionPool ) {
        if (connector) {
            this.client = connector;
        } else {
            this.client = null;
        }
    }

    async fetchRaw(query: string, value: any) :Promise<any>  {

        try {
            if (this.client) {
                let [rows, fields] = await this.client.execute(query, value);
                if (rows && Array.isArray(rows) && rows.length > 0) {
                    return rows;
                }
            }
            return null;
        } catch (exception) {
            console.log("DB Error", exception);
            console.error("QUERY: ", query);
            console.error("PARAMS: ", value);
            return Promise.reject(exception);
        }
    }

    async modify(query: string, value: any) :Promise<BtMysqlModifyResult | null>  {

        try {
            if (this.client) {
                let [rows, fields] = await this.client.execute(query, value);
                console.log('RESULT:', rows);
                return <BtMysqlModifyResult>rows;
            }
            return null;
        } catch (exception) {
            console.log("DB Error", exception);
            console.error("QUERY: ", query);
            console.error("PARAMS: ", value);
            return Promise.reject(exception);
        }

    }

    async fetchSingle(constructor: BtMysqlDataConstructor, query: string, value: any) :Promise<BtMysqlData>  {

        try {
            if (this.client) {
                let [rows, fields] = await this.client.execute(query, value);
                if (rows && Array.isArray(rows) && rows.length > 0) {
                    return new constructor(rows[0]);
                }
            }
            return new constructor();
        } catch (exception) {
            console.log("DB Error", exception);
            console.error("QUERY: ", query);
            console.error("PARAMS: ", value);
            return Promise.reject(exception);
        }

    }

    async fetchArray(constructor: BtMysqlDataConstructor, query: string, value: any) :Promise<Array<BtMysqlData>>  {

        try {
            const dataList:Array<BtMysqlData> = [];
            if (this.client) {
                let [rows, fields] = await this.client.execute(query, value);
                if (Array.isArray(rows) && rows.length > 0) {
                    rows.forEach(row => {
                        dataList.push(new constructor(row));
                    });
                }
            }
            return dataList;
        } catch (exception) {
            console.log("DB Error", exception);
            console.error("QUERY: ", query);
            console.error("PARAMS: ", value);
            return Promise.reject(exception);
        }

    }
}