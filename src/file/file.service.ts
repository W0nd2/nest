import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid'
import { IFileService } from './file.interface';

@Injectable()
export class FileService implements IFileService{

    async uploadFile(file):Promise<string>{
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static');
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName;
        } catch (error) {
            console.log(error)
            throw new HttpException(`Ошибка при записи файла`,HttpStatus.BAD_REQUEST);
        }
    }

}
