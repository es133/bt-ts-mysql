#!/usr/bin/env node

import { BtMysql } from '../src/BtMysql'
import { BtMysqlAbstractDao } from '../src/BtMysqlAbstractDao'
import {BtMysqlData} from "../src/BtMysqlData";

class DbData implements BtMysqlData {

    id: number = 0;
    title: string | null = null;
    content: string | null = null;

    constructor(row?:any, fields?: any) {
        if (row) {
            this.id = row['id'];
            this.title = row['title'];
            this.content = row['content'];
        }
    }

    build(): Record<string, any> {

        return {
            id: this.id,
            title: this.title,
            content: this.content
        };
    }

}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    connectionLimit: 20,
    timezone: 'Z'
};

console.log('Configuration:', dbConfig);

BtMysql.buildConnection(dbConfig).then( async singleConnection => {
    let singleConnectionDao = new BtMysqlAbstractDao(singleConnection);

    //const query = `SELECT * FROM article ORDER BY ID desc`;
    //let result = await singleConnectionDao.execute(query, []);
    const query = `SELECT * FROM data LIMIT 10`;
    let result = await singleConnectionDao.fetchArray(DbData, query, []);
    console.log('FETCH RESULT:', result);

    process.exit(0);
});

