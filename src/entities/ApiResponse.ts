export default class ApiResponse<T>{
    status: number;
    message: T;


    constructor(
        statusCode: number,
        message: T
    ){
        this.status = statusCode;
        this.message = message;
    }
}