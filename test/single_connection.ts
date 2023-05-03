#!/usr/bin/env node

import { BtMysql } from '../src/BtMysql'
import { BtMysqlAbstractDao } from '../src/BtMysqlAbstractDao'
import {BtMysqlData} from "../src/BtMysqlData";

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

    constructor(row?:any, fields?: any) {
        if (row) {
            this.id = row['id'];
            this.articleAlias = row['article_alias'];
            this.companyId = row['company_id'];
            this.memberId = row['member_id'];
            this.memberNickname = row['member_nickname'];
            this.memberCompanyId = row['member_company_id'];
            this.memberCompanyName = row['member_company_name'];
            this.title = row['title'];
            this.content = row['content'];
        }
    }

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

/*
class ArticleDataBuilder implements BtMysqlDataBuilder {

    private dataType: BtMysqlData;
    constructor(type: BtMysqlData) {
        this.dataType = type;
    }

    //Called by abstract dao
    create(rows: any, fields: any): BtMysqlData {
        this.dataType.fetch(rows);
    }

    createDefault(): BtMysqlData {
        return new ArticleData();
    }
}
 */

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
    const query = `SELECT * FROM article LIMIT 10`;
    let result = await singleConnectionDao.fetchArray(ArticleData, query, []);
    console.log('FETCH RESULT:', result);

    process.exit(0);
});

