import { Test } from "@nestjs/testing";
import * as supertest from "supertest";
import { AppModule } from '../app.module';

let loginUserDto={
    email:'user@gmail.com',
    password: '123456789'
};
let createUserDto={
    email:'newuser@gmail.com',
    login:'test',
    password:'12',
    role:1
}

describe('AuthController',()=>{
    let app;
    let httpServer;

    beforeAll( async()=>{
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
    })

    afterAll(async () => {
        await app.close();
    })

    it('Should login person', async ()=>{
        const response = await supertest(httpServer).post('/api/auth/login').send(loginUserDto);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            token: expect.any(String)
        })
    });

    it('Should NOT login person with incorrect email', async ()=>{
        loginUserDto.email = '1user@gmail.com';
        const response = await supertest(httpServer).post('/api/auth/login').send(loginUserDto);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            message: 'Пользователь не зареестрирован'
        })
    });

    it('Should NOT login person with incorrect password', async ()=>{
        loginUserDto.email = 'user@gmail.com';
        loginUserDto.password = '111111111';
        const response = await supertest(httpServer).post('/api/auth/login').send(loginUserDto);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: "Неверный пароль"
        })
    });

    it('Should NOT register new user with incorrect password', async ()=>{
        const response = await supertest(httpServer).post('/api/auth/registration').send(createUserDto);
        expect(response.status).toBe(400)
    })

    it('Should NOT register new user with incorrect login', async ()=>{
        createUserDto.password='123456789';
        createUserDto.login = 't';
        const response = await supertest(httpServer).post('/api/auth/registration').send(createUserDto);
        expect(response.status).toBe(400)
    })

    it('Should NOT register new user with incorrect email', async ()=>{
        createUserDto.email = "test";
        createUserDto.login = 'test';
        const response = await supertest(httpServer).post('/api/auth/registration').send(createUserDto);
        expect(response.status).toBe(400)
    })

    it('Should register new user', async ()=>{
        createUserDto.email = "newuser@gmail.com";
        const response = await supertest(httpServer).post('/api/auth/registration').send(createUserDto);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            message: 'Пользователь успешно зареистрирован'
        })
    })
});