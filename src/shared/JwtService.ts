import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { cookieProps } from '@shared/constants';
import { COOKIE_SECRET }  from '../../env/development';


interface IClientData {
    id: number;
    role: number;
}

export class JwtService {

    private readonly secret: string;
    private readonly options: object;
    private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';


    constructor() {
        this.secret =  COOKIE_SECRET;
        this.options = {expiresIn: cookieProps.options.maxAge.toString()};
    }


    /**
     * Encrypt data and return jwt.
     *
     * @param data
     */
    public getJwt(data: IClientData): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }


    /**
     * Decrypt JWT and extract client data.
     *
     * @param jwt
     */
    public decodeJwt(jwt: string): Promise<IClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors, decoded: object | string) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as IClientData);
            });
        });
    }
}
