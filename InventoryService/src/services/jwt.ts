import * as jwt from 'jwt-simple'
import moment from 'moment';
import { IUsuario } from '../models/tblUsuario';
import { secret } from '../keys';

export const createToken = (user: IUsuario) =>{
    var payload = {
        sub: user._id,
        code: user.code,
        strUsuario: user.strUsuario,
        strNombre: user.strNombre,
        strEmail: user.strEmail,
        blnSuperAdmin: user.blnSuperAdmin,
        accessLevel: user.accessLevel,
        rol: user.rol,
        iat: moment().unix(), //fecha de creacion del token
        exp: moment().add(1, 'days').unix() //fecha de expiracion del token
    };
    return jwt.encode(payload, secret);
};
