import express, {Application} from "express";
import dotenv from 'dotenv'
import { RegistrableController } from './controllers/Registerable.controller'
import container from './config/inersify.config';
import TYPES from './types/types'

import { apiErrorHandler } from './shared/error-handler/handler'

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
    }

    routes() {  // grabs the Controller from IoC container and registers all the endpoints
        const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
        controllers.forEach(controller => controller.register(this.app));
    }

    start() {
        this.app.listen(process.env.port || 4000, ()=> {
            console.log("Server is runing " + process.env.port)
        });
    }

    errorHandler(){
        this.app.use(apiErrorHandler)
    }
}

const app = new App();
app.start();