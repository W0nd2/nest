import { HttpException, HttpStatus } from "@nestjs/common";


export class ValidationEcxeption extends HttpException{
    message: string;

    constructor(response){
        super(response, HttpStatus.BAD_REQUEST);
        this.message = response;
    }
}