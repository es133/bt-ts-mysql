#!/usr/bin/env node

import { BtMysql } from '../src/BtMysql'
import { BtMysqlAbstractDao} from '../src/BtMysqlAbstractDao'
import { BtMysqlData} from "../src/BtMysqlData";

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

BtMysql.buildConnectionPool(dbConfig, true).then( async connectionPool => {
    let connectionDao = new BtMysqlAbstractDao(connectionPool);

    //const query = `SELECT * FROM article where id = ?`;
    const query = `UPDATE article SET title = 'TEST' WHERE id = ?`
    let result = await connectionDao.modify(query, [22170]);
    console.log('FETCH RESULT:', result);

    process.exit(0);
});

