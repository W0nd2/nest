import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function start(){
    const Port = process.env.Port || 5000;
    const app = await NestFactory.create(AppModule, { cors: {credentials: true} } );

    await app.listen(Port,()=> console.log(`Server started on port ${Port}`));
}

start();