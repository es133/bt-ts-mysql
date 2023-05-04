# bt-ts-mysql
- A node-mysql2(https://github.com/sidorares/node-mysql2) wrapping library for typescript

### Installation

   - Create .npmrc in project root directory
   ```
    @es133:registry=https://npm.pkg.github.com/
    //npm.pkg.github.com/:_authToken={YOUR GITHUB PAT(Personal Access Token)}
   ```
   - Add dependancy item In package.json file, add this
   ```
   "dependencies": {
       ...
       "@es133/bt-ts-mysql": "1.0.0"
       ...
   },
   ```
### How to Use 

#### In case using Nestjs

1. Add configuration
   - mysql.config.ts
    ```typescript
    import { registerAs } from '@nestjs/config';

    export default registerAs('mysql', () => ({
        db_config: {
            host: 'localhost',
            user: 'user',
            port: 3306,
            password: 'password',
            charset: 'utf8mb4',
            connectionLimit: 20,
            database: 'db_name',
            timezone: 'Z',
        },
    }));
    ```
    - Add mysql configuration to app.module.ts file
    ```typescript
    @Module({
        imports: [
            ConfigModule.forRoot({
                envFilePath:...,
                isGlobal: true,
                load: [Config, MysqlConfig],
            }),
        ],
        controllers: [AppController],
        providers: [AppService],
    })
    export class AppModule {}

    ```

2. Create providers
   ```typescript
   import { Inject, Injectable } from '@nestjs/common';
   import { TbMysql } from 'tb-mysql';
   import { TbMysqlConnectionPool } from 'tb-mysql';
   import { MysqlReadConfig } from '../../config/mysql/MysqlReadConfig';

   @Injectable()
   export class MysqlReadClientService {
      public readClient: TbMysqlConnectionPool | null;
      constructor(@Inject(MysqlReadConfig) private readonly readConfig: MysqlReadConfig) {
         TbMysql.buildConnectionPool(readConfig.configuration, true)
            .then((connection) => {
                this.readClient = connection;
         })
         .catch((exception) => {
            console.error(exception);
            throw exception;
         });
      }
   }

    ```
3. Create abstract dao 
   ```typescript
   import { Inject, Injectable } from '@nestjs/common';
   import { MysqlReadClientService } from '../../providers/mysql/MysqlReadClientService';
   import { TbMysqlAbstractDao } from 'tb-mysql';

   @Injectable()
   export abstract class AbstractDbModel {
      protected readDao: TbMysqlAbstractDao;

      protected constructor(
        @Inject(MysqlReadClientService) protected readonly readClient: MysqlReadClientService
      ) {
        this.readDao = new TbMysqlAbstractDao(readClient.readClient);
      }
   }
   ```

4. Using dao 
   ```typescript
   @Injectable()
   export class MemberDbModel extends AbstractDbModel {
      constructor(
        @Inject(MysqlReadClientService) protected readonly readClient: MysqlReadClientService,
        @Inject(MysqlWriteClientService) protected readonly writeClient: MysqlWriteClientService,
      ) {
            super(readClient, writeClient); 
        }

        public async getMemberByMemberId(memberId: number): Promise<MemberDbData> {
            const query = 'SELECT * FROM member WHERE id = ?';
            const result = <MemberDbData>await this.readDao.fetchSingle(MemberDbData, query, [memberId]);
            return result;
        }
      ...
   }
   ```

