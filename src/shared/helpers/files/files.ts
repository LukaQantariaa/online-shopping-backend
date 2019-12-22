import 'reflect-metadata';
import {injectable} from 'inversify';
import * as fs from 'fs';
import * as HttpStatus from "http-status-codes";
import rimraf from 'rimraf';
import dotenv from 'dotenv';


export interface Files {
    uploadImages(images: any, directyory: string): any; //Promise<string>
}

@injectable()
export class FilesImp implements Files {

    private ImageExtension: Array<string> = ['.jpeg', '.jpg', '.png', '.gif'];

    private async checkDirectory(directory: string){
        if (fs.existsSync(directory)) {
            return true
        } else {
            return false
        }
    }

    private async createDirectory(directory: string) {
        try {
            fs.mkdirSync(directory);
            return true
        } catch(err) {

        }
    }

    private async deleteDirectory(directory: string) {
        rimraf(directory, function () { 
            return true;
        });
    }

    private uploadFile(file:any, directory: string, name: string | number, extensions: Array<string>) {
        let allowed = false;

        // Check extension
        const fileExtension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity)); // file extension
        extensions.forEach((extension: string) => {
            if(fileExtension.toLowerCase() === extension) {
                allowed = true;
            }
        });

        if(allowed === false) {
            throw(`${fileExtension} extension is not allowed!`)
        }

        // Upload
        const fileName = file.mv(`${directory}/${name}${fileExtension}`).then(() => {
            console.log(`uploaded => ${file.name}`);
            return `${directory}/${name}${fileExtension}`
        });

        return fileName
    }

    public async uploadImages(images: any, directory: string){

        // Check Directory
        const exists = await this.checkDirectory(directory);
        if(!exists) { 
            // Create Directory
            const create = await this.createDirectory(directory)
        }

        // Upload Images
        images.forEach((image: any, index: number) => {
            const fileExtension = image.name.slice((Math.max(0, image.name.lastIndexOf(".")) || Infinity));
            console.log(fileExtension)
            try {
                this.uploadFile(image, directory, index, this.ImageExtension)
            } catch(err) {
                this.deleteDirectory(directory)
                throw({value: err, statusCode: HttpStatus.BAD_REQUEST})
            }
        })
        
        return true;
    }

}