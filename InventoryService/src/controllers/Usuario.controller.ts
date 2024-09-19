import {Request, Response} from 'express';
import * as jwt from '../services/jwt';
import UsuarioModel from '../models/tblUsuario';
import AccesoModel from '../models/tblAcceso';
import UsuarioAccesoModel from '../models/tblUsuarioAcceso';

class UsuarioController {
    public async loginOdoo(req: Request, res: Response) {
        var params = req.body;
        var _user = params.strUsuario;
        var _password = params.strPassword;

        let userFind = await UsuarioModel.findOne({strEmail: _user, status: true});
        if(userFind) {
            let accesos = await UsuarioAccesoModel.find({usuario: userFind._id}).sort({ 'level': 1, 'subLevel': 1, 'index': 1 }).populate({path: 'acceso'});
            if (userFind.strPassword == _password) {
                const userTemp: any = {
                    _id: (userFind)? userFind._id : '-1',
                    code: 'USU-001',
                    strNombre: userFind.strNombre + ' ' + userFind.strApellidos,
                    strUsuario: userFind.strNombre + ' ' + userFind.strApellidos,
                    strEmail: userFind.strEmail,
                    blnSuperAdmin: (userFind)? userFind.blnSuperAdmin : false,
                    accessLevel: (userFind)? userFind.accessLevel : 'read',
                    rol: (userFind)? userFind.rol : 'ALMACEN'
                }

                if (params.gethash) {
                    res.status(200).send({
                        message: 'Bienvenido: ' + userTemp.strNombre.toUpperCase(),
                        usuario: userTemp,
                        accesos: accesos,
                        token: jwt.createToken(userTemp)
                    });
                } else {
                    res.status(200).send({message: 'Bienvenido: '+userTemp.strNombre.toUpperCase(), usuario: userTemp, accesos: accesos });
                }
            } else {
                res.status(404).send({ message: 'Usuario y/o password incorrectos.' });
            }
        } else {
            res.status(404).send({message: 'El usuario ingresado no esta habilitado: '+_user });
        }
    }

    public async searchUsers(req: Request, res: Response) {
        const users = await UsuarioModel.find();
        res.status(200).send({ Data: users, Count: users.length });
    }
    public async getUser(req: Request, res: Response) {
        const idUser = req.params.iduser;
        const usuario = await UsuarioModel.findOne({ _id: idUser });
        let accesos = await UsuarioAccesoModel.find({usuario: idUser}).sort({ 'level': 1, 'subLevel': 1, 'index': 1 });
        res.status(200).send( {user: usuario, access: accesos} );
    }
    public async saveUser(req: Request, res: Response) {
        const user = new UsuarioModel();
        let params = req.body;
        user.strNombre = params.strNombre;
        user.strApellidos = params.strApellidos;
        user.strEmail = params.strEmail;
        user.blnSuperAdmin = params.blnSuperAdmin;
        user.strUsuario = params.strUsuario;
        user.strPassword = params.strPassword;
        user.passEmail = params.passEmail;
        user.status = true;
        user.accessLevel = params.accessLevel;
        user.rol = params.rol;

        let access_user: any = params.access;
        
        let userFind = await UsuarioModel.findOne({strEmail: user.strEmail, status: true});
        if(userFind) {
            res.status(200).send({ message: 'Ya existe un usuario con este correo: '+ user.strEmail });
        } else {
            let userStored = await user.save();
            if (!userStored) {
                res.status(404).send({ message: 'El usuario: '+user.strNombre+', no ha sido guardado.' });
            } else {
                if (access_user) {
                    for (let i = 0; i < access_user.length; i++) {
                        const item = {
                            accessLevel: access_user[i].accessLevel,
                            acceso: access_user[i].acceso,
                            usuario: userStored['_id'],
                        }
                        await UsuarioAccesoModel.create( item );
                    }
                }
                res.status(200).send({ message: 'Usuario guardado correctamente: '+ user.strNombre, user: userStored });
            }
        }
        
    }
    public async updateUser(req: Request, res: Response) {
        var userId = req.params.id;
        let params = req.body;
        var update = params.user;
        let access_user: any = params.access;
        try {
            let userUpdated = await UsuarioModel.findByIdAndUpdate(userId, update)
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                if (access_user) {
                    await UsuarioAccesoModel.remove({ usuario: userId });
                    for (let i = 0; i < access_user.length; i++) {
                        const item = {
                            accessLevel: access_user[i].accessLevel,
                            acceso: access_user[i].acceso,
                            usuario: userId,
                        }
                        await UsuarioAccesoModel.create( item );
                    }
                }
                res.status(200).send({ message: 'Guardado correctamente', user: userUpdated });
            }
        } catch(err) {
            res.status(500).send({ message: 'Error al actualizar usuario' });
        }
    }
    public async deleteUser(req: Request, res: Response) {
        let userId = req.params.id;
        try {
            let userDeleted = await UsuarioAccesoModel.remove({ _id: userId });
            if (!userDeleted) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ message: 'Eliminado correctamente', user: userDeleted });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error al eliminar usuario' });
        }
    }


    // ACCESOS
    public async saveAcceso(req: Request, res: Response) {
        let params = req.body;
        try {
            const acceso = new AccesoModel();
            acceso.code = params.code;
            acceso.description = params.description;
            acceso.link = params.link;
            acceso.level = params.level;
            acceso.subLevel = params.subLevel;
            acceso.index = params.index;
            acceso.iconName = params.iconName;
            acceso.status = true;
            let accessStored = await acceso.save();
            if (!accessStored) {
                res.status(404).send({ message: 'Este acceso, no ha sido guardado.' });
            } else {
                res.status(200).send({ message: 'Acceso guardado correctamente: '+ accessStored.description, access: accessStored });
            }
        } catch (e) {
            res.status(500).send({ message: 'Error al guardar acceso' });
        }
    }
    public async searchAccesos(req: Request, res: Response) {
        try {
            const accesos = await AccesoModel.find().sort({ 'level': 1, 'subLevel': 1, 'index': 1 });
            res.status(200).send({ Data: accesos, Count: accesos.length });
        } catch(e) {
            res.status(500).send({ message: 'Error al cargar accesos' });
        }
    }
}
export const usuarioController = new UsuarioController();