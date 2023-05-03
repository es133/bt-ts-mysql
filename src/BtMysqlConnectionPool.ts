'use strict';

import {Connection, Pool} from "mysql2/promise";

export class BtMysqlConnectionPool {

    protected connectionPool?: Pool;

    constructor (connectionPool:Pool, showPoolState:boolean = false) {
        if (!connectionPool) {
            console.error('Invalid connection pool');
            return;
        }

        this.connectionPool = connectionPool;
        if (showPoolState) {
            this.connectionPool.on('acquire', (connection)=> {
                //console.log('Connection %d acquired', connection['threadId']);
            })

            this.connectionPool.on('connection', (connection) => {
                //connection.query('SET SESSION auto_increment_increment=1')
                //console.log('Connection %d increased', connection['threadId']);
            });

            this.connectionPool.on('enqueue', () => {
                //console.log('Waiting for available connection slot');
            });

            this.connectionPool.on('release', function (connection) {
                //console.log('Connection %d released', connection['threadId']);
            });

        }
    }

    async getConnection():Promise<Connection| null> {
        try {
            if (this.connectionPool) {
                return await this.connectionPool.getConnection();
            } else {
                return null;
            }
        } catch (exception) {
            throw exception;
        }
    }

    async execute(query: string, value: any): Promise<any>{

        if (this.connectionPool) {
            const [rows, field] = await this.connectionPool.execute(query, value);
            return [rows, field];
        }
    }

    disconnectPool() {
        try {
            if (this.connectionPool) {
                this.connectionPool.end();
            }

        } catch (exception) {
            throw exception;
        }
    }
}