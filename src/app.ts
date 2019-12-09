import express, {Application} from "express";
import dotenv from 'dotenv'

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

    routes() {

    }

    start() {
        this.app.listen(process.env.port || 4000, ()=> {
            console.log("Server is runing " + process.env.port)
        });
    }

    errorHandler(){
        
    }
}

const app = new App();
app.start();