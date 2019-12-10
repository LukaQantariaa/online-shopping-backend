import {injectable} from 'inversify';


export interface UsersRepository {
    findAll(): Promise<Array<{name: string; surname: string}>>;
}

@injectable()
export class UsersRepositoryImp implements UsersRepository {
    public findAll(): Promise<Array<{name: string, surname: string}>> {

        // Fake data
        return new Promise( (reslove, reject) => {
            setTimeout(() => {
                reslove([
                    {name: 'John', surname: "Doe"}, 
                    {name: "John2", surname: "Doe2"}
                ]);  
            }, 3000);
        })
    }
}