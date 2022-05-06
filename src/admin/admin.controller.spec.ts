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
    })

    afterAll(async () => {
        await app.close();
    })

    it('Should return manager by id', async ()=>{
        const response = await supertest(httpServer).get('/api/admin/managerByID?id=2').set("authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: expect.any(String),
            login: expect.any(String),
            roleId: 2
        });
    });

    it('Should NOT return manager by id without admin token', async()=>{
        const response = await supertest(httpServer).get('/api/admin/managerByID?id=2').set("authorization", `Bearer ${userToken}`);
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
        const response = await supertest(httpServer).get('/api/admin/managerByID?id=2').set("authorization", `Bearer ${adminToken}s`);
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

});