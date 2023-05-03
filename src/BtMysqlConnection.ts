'use strict';

import {Connection, ConnectionOptions, QueryError} from 'mysql2/promise'

export class BtMysqlConnection {

    protected connection?: Connection ;

    constructor (connection: Connection) {
        if (!connection) {
            console.error('Invalid parameters');
            return;
        }

        this.connection = connection;
        //console.log('CONNECTION:', this[_connection]);
    }

    /*
    get connection():Connection | null {
        try {
            if (this.connection) {
                return this.connection
            } else {
                return null;
            }
        } catch (exception) {
            throw exception;
        }
    }
     */

    getConnection():Connection | null {
        try {
            if (this.connection) {
                return this.connection;
            } else {
                return null;
            }
        } catch (exception) {
            throw exception;
        }
    }

    async disconnectGraceful():Promise<void> {
        return new Promise((resolve, reject) =>  {
            if (this.connection) {
                this.connection.end((error: QueryError | null) => {
                    if (error) {
                        console.error('BtMysql Error:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    async execute(query: string, value: any): Promise<any>{

        if (this.connection) {
            const [rows, fields] = await this.connection.execute(query, value);
            this.connection.unprepare(query);
            return [rows, fields];
        }
    }

    disconnectImmediate(): void {
        if (this.connection) {
            this.connection.destroy();
        }
    }

    connectionOption(): ConnectionOptions | null  {
        if (this.connection) {
            return this.connection.config;
        } else {
            return null;
        }
    }

    enableNamePlaceHolder():void {
        if (this.connection) {
            this.connection.config.namedPlaceholders = true;
        }
    }

    disableNamePlaceHolder():void {
        if (this.connection) {
            this.connection.config.namedPlaceholders = false;
        }
    }

}
