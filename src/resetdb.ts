import { Test } from "@nestjs/testing";
import { Op } from "sequelize";
import { AppModule } from "./app.module";
import { AproveList } from "./models/aprove-list.model"
import { Banlist } from "./models/banlist.model";
import { UserComand } from "./models/user-comand.model";
import { Users } from "./models/users.model";

(async ()=>{
    let app;
    const moduleRef = await Test.createTestingModule({
        imports:[AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    console.log('Reseting the DB...');
    await AproveList.truncate({cascade:true});
    await Banlist.truncate({cascade:true});
    await UserComand.truncate({cascade:true});
    await Users.destroy({
        where:{
            id:{
                [Op.ne]:1,
            }
        }
    });
    await app.close();
})();