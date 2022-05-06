import { Test } from "@nestjs/testing";
import * as supertest from "supertest";
import { AppModule } from '../app.module';

let loginUserDto={
    email:'user@gmail.com',
    password: '123456789'
};

let changeLoginDto={
    newLogin: 'newTest'
}

let JoinTeamDto ={
    comandId:1
}

let userToken:string;

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
        const response = await supertest(httpServer).post('/api/auth/login').send(loginUserDto);
        userToken = response.body.token;
    })

    afterAll(async () => {
        await app.close();
    })

    it('Should return user profile', async ()=>{
        const response = await supertest(httpServer).get('/api/user/profile').set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: expect.any(String),
            login: expect.any(String),
            roleId: expect.any(Number),
            accountType: expect.any(String)
        });
    });

    it('Should NOT return user profile with incorrect user token', async ()=>{
        const response = await supertest(httpServer).get('/api/user/profile').set("authorization", `Bearer ${userToken}s`);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });

    it('Should change user login', async ()=>{
        const response = await supertest(httpServer).patch('/api/user/login/change').set("authorization", `Bearer ${userToken}`).send(changeLoginDto);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: expect.any(String),
            login: changeLoginDto.newLogin,
            roleId: expect.any(Number),
            accountType: expect.any(String)
        });
    });

    it('Should NOT change user login with incorrect user token', async ()=>{
        const response = await supertest(httpServer).patch('/api/user/login/change').set("authorization", `Bearer ${userToken}s`).send(changeLoginDto);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });

    it('Should send user request to join team', async ()=>{
        const response = await supertest(httpServer).post('/api/user/newTeamMember').set("authorization", `Bearer ${userToken}`).send(JoinTeamDto);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 'pending',
            type: 'join team',
            id: expect.any(Number),
            userId: expect.any(Number),
            comandId: JoinTeamDto.comandId,
        });
    });

    it('Should NOT send user request to join team with incorrect user token', async ()=>{
        const response = await supertest(httpServer).post('/api/user/newTeamMember').set("authorization", `Bearer ${userToken}s`).send(JoinTeamDto);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });

    it('Should NOT decline user request to join team with incorrect user token', async ()=>{
        const response = await supertest(httpServer).delete('/api/user/declineQueue').set("authorization", `Bearer ${userToken}s`).send(JoinTeamDto);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });

    it('Should decline user request to join team', async ()=>{
        const response = await supertest(httpServer).delete('/api/user/declineQueue').set("authorization", `Bearer ${userToken}`).send(JoinTeamDto);
        expect(response.body).toMatchObject({
            message: expect.any(String)
        });
    });

    it('Should return team members', async ()=>{
        const response = await supertest(httpServer).get('/api/user/teamMembers?comandId=1&userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(200);
    });

    it('Should NOT return team members with incorrect user token', async ()=>{
        const response = await supertest(httpServer).get('/api/user/teamMembers?comandId=1&userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}s`)
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });

    it('Should return users from 2 teames', async()=>{
        const response = await supertest(httpServer).get('/api/user/allMembers?userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
            [
                {
                    id: expect.any(Number),
                    comandName: expect.any(String),
                    users: expect.any(Array)
                },
                {
                    id: expect.any(Number),
                    comandName: expect.any(String),
                    users: expect.any(Array)
                }
            ]
        );
    });

    it('Should NOT return users from 2 teames with incorrect token', async()=>{
        const response = await supertest(httpServer).get('/api/user/allMembers?userLimit=10&offsetStart=0').set("authorization", `Bearer ${userToken}s`)
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            messahe: 'Пользователь не прошел авторизацию'
        });
    });
});