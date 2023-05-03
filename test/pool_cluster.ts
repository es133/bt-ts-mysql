#!/usr/bin/env node

import {BtMysqlData} from "../src/BtMysqlData";

const dbConfig = {
    read_db: {
        host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            charset: 'utf8mb4',
            connectionLimit: 20,
            timezone: 'Z'

    },
    write_db: {
        host: process.env.RDB_HOST,
        user: process.env.RDB_USER,
        password: process.env.RDB_PASSWD,
        database: process.env.RDB_NAME,
        charset: 'utf8mb4',
        connectionLimit: 30,
        timezone: 'Z'
    }
};


class ArticleData implements BtMysqlData {

    id: number = 0;
    articleAlias: string | null = null;
    companyId: number = 0;
    memberId: number = 0;
    memberNickname: string | null = null;
    memberCompanyId: number = 0;
    memberCompanyName: string | null = null;
    title: string | null = null;
    content: string | null = null;
    isAuth: string =  'N';
    pollId: number = 0;
    likeCount: number = 0;
    commentCount: number = 0;
    reportCount: number = 0;
    viewCount: number = 0;
    bookmarkCount: number = 0;
    isAshamed: string = 'N';
    isHiddenCompany: string = 'N';
    createdFrom: string = 'APP';
    isShowWeb: string = 'Y';
    isHighlight: string = 'Y';
    utcOffset: number = 0;
    timezone: string | null = null;
    geonameId: number | null = null;
    updatedAt: Date | null = null;
    createdAt: Date | null = null;

    build(): Record<string, any> {

        return {
            id: this.id,
            articleAlias: this.articleAlias,
            companyId: this.companyId,
            memberId: this.memberId,
            memberNickname: this.memberNickname,
            memberCompanyId: this.memberCompanyId,
            memberCompanyName: this.memberCompanyName,
            title: this.title,
            content: this.content
        };
    }

}

class ArticleDataBuilder implements BtMysqlData {

    //Called by abstract dao
    create(rows: any, fields: any): BtMysqlData {
        return new ArticleData();
    }

    createDefault(): BtMysqlData {
        return new ArticleData();
    }

}

console.log('Configuration:', dbConfig);

/*
BtMysql.buildClusterPool(dbConfig, true).then( async poolCluster => {

    let connectionDao = new BtMysqlAbstractDao(poolCluster);
    const query = `SELECT * FROM article ORDER BY ID desc`;

    let dataBuilder = new ArticleDataBuilder();
    let result = await connectionDao.execute(dataBuilder, query, [], 'read_db');

    console.log('FETCH RESULT:', result);
    process.exit(0);
});



 */