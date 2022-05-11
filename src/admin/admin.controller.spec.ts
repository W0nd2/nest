import { Test } from "@nestjs/testing";
import * as supertest from "supertest";
import { AppModule } from '../app.module';

let loginUserDto={
    email:'user@gmail.com',
    password: '123456789'
};

let loginAdminDto={
    email:'admin@gmail.com',
    password: '123456789'
};

let userBlockDto={
    id:2,
    reason:"Spam",
    blockFlag:true
}

let unblockUserDto={
    id:2,
    reason:'',
    blockFlag:false
}

let confirmManagerDto={
    id: 3,
    reason: "test"
}

let userToken:string;
let adminToken:string;

describe('UserController',()=>{
    let app;
    let httpServer;

    beforeAll( async()=>{
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
        const user = await supertest(httpServer).post('/api/auth/login').send(loginUserDto);
        userToken = user.body.token;
        const admin = await supertest(httpServer).post('/api/auth/login').send(loginAdminDto);
        adminToken = admin.body.token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('Should not confirm manager without user token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/confirmManager').set("authorization", `Bearer ${userToken}`).send(confirmManagerDto);
        expect(response.body).toMatchObject(
            {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden'
            }
        );
    });

    it('Should not confirm manager with incorrect admin token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/confirmManager').set("authorization", `Bearer ${adminToken}s`).send(confirmManagerDto);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });

    it('Should confirm new manager', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/confirmManager').set("authorization", `Bearer ${adminToken}`).send(confirmManagerDto);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: expect.any(String),
            login: expect.any(String),
            roleId: 2
        });
    });

    it('Should return manager by id', async ()=>{
        const response = await supertest(httpServer).get(`/api/admin/managerByID?id=${confirmManagerDto.id}`).set("authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: expect.any(String),
            login: expect.any(String),
            roleId: 2
        });
    });

    it('Should NOT return manager by id without admin token', async()=>{
        const response = await supertest(httpServer).get(`/api/admin/managerByID?id=${confirmManagerDto.id}`).set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden'
            }
        );
    });

    it('Should NOT return manager by id with incorrect admin token', async()=>{
        const response = await supertest(httpServer).get(`/api/admin/managerByID?id=${confirmManagerDto.id}`).set("authorization", `Bearer ${adminToken}s`);
        expect(response.status).toBe(403);
    });

    it('Should return all Managers', async()=>{
        const response = await supertest(httpServer).get('/api/admin/allManagers?userLimit=10&offsetStart=0').set("authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
    })

    it('Should NOT return all managers without admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/allManagers?userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                statusCode: 403,
                message: 'Forbidden resource',
                error: 'Forbidden'
            }
        );
    });

    it('Should NOT return all managers with incorrect admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/allManagers?userLimit=10&offsetStart=0').set("authorization", `Bearer ${adminToken}s`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });

    it('Should return user by id', async()=>{
        const response = await supertest(httpServer).get('/api/admin/userById?id=1').set("authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            {
                id: expect.any(Number),
                email: expect.any(String),
                login: expect.any(String),
                roleId: expect.any(Number)
            }
        );
    });

    it('Should NOT return user by id without admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/userById?id=1').set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'Forbidden resource'
            }
        );
    });

    it('Should NOT return user by id with incorrect admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/userById?id=1').set("authorization", `Bearer ${adminToken}s`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });

    it('Should return queue', async()=>{
        const response = await supertest(httpServer).get('/api/admin/queue?userLimit=10&offsetStart=0').set("authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            queue: expect.any(Array)
        });
    });

    it('Should NOT return queue without admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/queue?userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'Forbidden resource'
            }
        );
    });

    it('Should NOT return queue with incorrect token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/queue?userLimit=10&offsetStart=0').set("authorization", `Bearer ${adminToken}s`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });
    
    it('Should NOT block user without admin token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/blockUser').set("authorization", `Bearer ${userToken}`).send(userBlockDto);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'Forbidden resource'
            }
        );
    });

    it('Should NOT block user with incorrect admin token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/blockUser').set("authorization", `Bearer ${adminToken}s`).send(userBlockDto);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });

    it('Should block user', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/blockUser').set("authorization", `Bearer ${adminToken}`).send(userBlockDto);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            userId: expect.any(Number),
            isBlocked: expect.any(Boolean),
            reason: expect.any(String)
        });
    });

    it('Should NOT block already blocked user', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/blockUser').set("authorization", `Bearer ${adminToken}`).send(userBlockDto);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: expect.any(String)
        });
    });

    it('Should NOT unblock user without admin token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/unblockUser').set("authorization", `Bearer ${userToken}`).send(unblockUserDto);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'Forbidden resource'
            }
        );
    });

    it('Should NOT unblock user with incorrect admin token', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/unblockUser').set("authorization", `Bearer ${adminToken}s`).send(unblockUserDto);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject(
            {
                message:'У пользователся не достаточно прав'
            }
        );
    });

    it('Should unblock user', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/unblockUser').set("authorization", `Bearer ${adminToken}`).send(unblockUserDto);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            userId: expect.any(Number),
            isBlocked: expect.any(Boolean),
            reason: expect.any(String)
        });
    });

    it('Should NOT unblack already unblocked user', async()=>{
        const response = await supertest(httpServer).patch('/api/admin/unblockUser').set("authorization", `Bearer ${adminToken}`).send(unblockUserDto);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: expect.any(String)
        });
    });
    
});