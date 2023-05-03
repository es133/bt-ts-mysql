export class Config {
    static dbConfig() {
        return {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            charset: 'utf8mb4',
            connectionLimit: 20,
            timezone: 'Z'
        };
    }

    static rdbConfig(){
        return {
            host: process.env.RDB_HOST,
            user: process.env.RDB_USER,
            password: process.env.RDB_PASSWD,
            database: process.env.RDB_NAME,
            charset: 'utf8mb4',
            connectionLimit: 20,
            timezone: 'Z'
        }
    }
}

export {}