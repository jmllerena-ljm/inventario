import { NextFunction } from 'connect';
import { Response, Request } from 'express';
import { secret } from '../keys';
import * as jwt from 'jwt-simple'
import moment from 'moment';

export let ensureAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cebecera de autenticacion' });
    }
    let token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        let payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token ha expirado, vuelva a iniciar sesión' });
        }
        const { strNombre, blnSuperAdmin, accessLevel, rol, iat, exp, ...session } = payload;
        req.body.sessionUser = session;
    } catch (ex) {
        return res.status(401).send({ message: 'token no valido, vuelva a iniciar sesión' });
    }
    // res.user = payload;
    next();
}