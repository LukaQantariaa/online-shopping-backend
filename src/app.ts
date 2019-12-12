import express, {Application} from "express";
import dotenv from 'dotenv'
import morgan from "morgan"
import * as bodyParser from 'body-parser'
import * as fileUpload from 'express-fileupload'

import container from './config/inersify.config';
import TYPES from './types/types'

import { RegistrableController } from './controllers/Registerable.controller'
import { apiErrorHandler } from './shared/error-handler/handler'
import { db } from './config/database'

class App {

    app: Application

    constructor() {
        this.app = express(),
        this.config();
        this.routes();
        this.errorHandler();
    }

    config() {
        dotenv.config();
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
        this.app.use(fileUpload.default())
        db.authenticate()
            .then( ()=>{ console.log("Database connected!") } )
            .catch(() => { console.log('Database error') })
    }

    routes() {  // grabs the Controller from IoC container and registers all the endpoints
        const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
        controllers.forEach(controller => controller.register(this.app));
    }

    start() {
        this.app.listen(process.env.PORT || 4000, ()=> {
            console.log("Server is runing")
        });
    }

    errorHandler(){
        this.app.use(apiErrorHandler)
    }
}

const app = new App();
app.start();