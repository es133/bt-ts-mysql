export interface BtMysqlData {
    toString():string;
}

export interface BtMysqlDataConstructor {
    new(row?:any, fields?:any):BtMysqlData;
}

export type BtMysqlModifyResult = {
    fieldCount: number | 0,
    affectedRows: number | 0,
    insertId: number | 0,
    info: string | null;
    serverStatus: number | 0,
    warningStatus: number | 0,
    changedRows: number | 0
}