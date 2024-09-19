import {Request, Response} from 'express';
import { api_url_odoo, api_url_sig, credential, credential_odoo13, partner_name, path_documents } from '../keys';
import axios from 'axios';
import PDFDocument from "pdfkit";
import qrcode from "qrcode";
import fs from 'fs';
import path from 'path';

class LotesController {
    public async saveLote(req: Request, res: Response) {
        let query = req.body;
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('Lote', query.Lote);
            params.append('FechaRecepcion', query.FechaRecepcion);
            params.append('Zona', query.Zona);
            params.append('Acopiador', query.Acopiador);
            params.append('ClienteRuc', query.ClienteRuc);
            params.append('ClienteRazonS', query.ClienteRazonS);
            params.append('PesoTmh', query.PesoTmh);
            params.append('H2o', query.H2o);
            params.append('PSecoTM', query.PSecoTM);
            params.append('LeyAu', query.LeyAu);
            params.append('LeyAg', query.LeyAg);
            params.append('Material', query.Material);
            params.append('EstadoLiq', query.EstadoLiq);
            params.append('TipoLiquid', query.TipoLiquid);
            params.append('LeyAuLiq', query.LeyAuLiq);
            params.append('LeyAgLiq', query.LeyAgLiq);
            params.append('H2oLiq', query.H2oLiq);
            params.append('PSecoLiq', query.PSecoLiq);
            params.append('RecAu', query.RecAu);
            params.append('PrecioAu', query.PrecioAu);
            params.append('MargenPI', query.MargenPI);
            params.append('Maquila', query.Maquila);
            params.append('ConsumoQ', query.ConsumoQ);
            params.append('GastAdm', query.GastAdm);
            params.append('SobreCosto', query.SobreCosto);
            params.append('RecAg', query.RecAg);
            params.append('PrecioAg', query.PrecioAg);
            params.append('MargenAg', query.MargenAg);
            params.append('CalculoEspec', query.CalculoEspec);
            params.append('CostoTotal', query.CostoTotal);
            params.append('CostoAnalisis', query.CostoAnalisis);
            params.append('Descuento', query.Descuento);
            params.append('NBaseAu', query.NBaseAu);
            params.append('NBaseAg', query.NBaseAg);
            params.append('PersonaPropuesta', query.PersonaPropuesta);
            params.append('FechaPropuesta', query.FechaPropuesta);
            params.append('LoteVolado', query.LoteVolado);
            params.append('CompanyID', query.CompanyID);
            params.append('Grupo', query.Grupo);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(api_url_odoo+'modelpurchaseliquidation', params, options)
            .then( response => {
                let _res_string = JSON.stringify(response.data.replace(/'/g, '"'));
                let respuesta = JSON.parse(_res_string);
                res.status(200).send( respuesta );
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al registrar lote en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al registrar lote en odoo 13', error: err });
        }
    }
    public async saveZona(req: Request, res: Response) {
        let query = req.body;
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('Code', query.Code);
            params.append('Nombre', query.Nombre);
            params.append('CtaAnalitica', query.CtaAnalitica);
            params.append('CompanyID', query.CompanyID);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(api_url_odoo+'modelzone', params, options)
            .then( response => {
                let _res_string = JSON.stringify(response.data.replace(/'/g, '"'));
                let respuesta = JSON.parse(_res_string);
                res.status(200).send( respuesta );
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al registrar zona en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al registrar zona en odoo 13', error: err });
        }
    }
    public async saveAcopiador(req: Request, res: Response) {
        let query = req.body;
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('Code', query.Code);
            params.append('Nombre', query.Nombre);
            params.append('CompanyID', query.CompanyID);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(api_url_odoo+'modelcollector', params, options)
            .then( response => {
                let _res_string = JSON.stringify(response.data.replace(/'/g, '"'));
                let respuesta = JSON.parse(_res_string);
                res.status(200).send( respuesta );
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al registrar acopiador en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al registrar acopiador en odoo 13', error: err });
        }
    }
    public async searchGrupo(req: Request, res: Response) {
        let query = req.body;
        try {
            const params = new URLSearchParams();
            params.append('UserName', credential_odoo13.user);
            params.append('Password', credential_odoo13.pass);
            params.append('ID', query.ID);
            params.append('Item', query.Item);
            params.append('Name', query.Name);
            params.append('CompanyID', query.CompanyID);

            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(api_url_odoo+'purchaseliquidationgroupreport', params, options)
            .then( response => {
                if (response.data.toString() != '') {
                    let _res_string = response.data.replace(/'/g, '"');
                    let respuesta = JSON.parse(_res_string);
                    res.status(200).send( respuesta );
                } else {
                    res.status(200).send( "-" );
                }
            })
            .catch( e => {
                res.status(404).send({ message: 'Error al buscar grupos en odoo 13', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al buscar grupos en odoo 13', error: err });
        }
    }

    public async uploadFile(req: any, res: Response) {
        try {
            if (req.file) {
                let _file = req.file;
                // if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
                    let updateDoc: any = {
                        file_name: _file.originalname,
                        file_path: _file.filename,
                        file_type: _file.mimetype
                    }
                    
                    res.status(200).send({ message: 'Documento subido!', file: updateDoc });
                // } else {
                //     res.status(200).send({ message: 'Extension del archivo no valida' });
                // }
            } else {
                res.status(200).send({ message: 'No has subido ninguna archivo...' });
            }
        } catch(e) {
            res.status(500).send({ message: 'Error al subir archivo!', error: e });
        }
    }
    
    public async getFile(req: Request, res: Response) {
        let nameFile = req.params.docFile;
        let pathFile = path_documents+'files-sig/' + nameFile
        fs.exists(pathFile, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(pathFile))
            } else {
                res.status(200).send({ message: 'No existe el archivo!' });
            }
        })
    }

    public async readFile(req: Request, res: Response) {
        let query = req.body;
        try {
            const options = {
                headers: {
                    'Authorization': 'bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiVVNVMDAwMDAwMDAxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJQRVIwMDAwMDAwMDEiLCJleHAiOjE2NTI4OTY1MTYsImlzcyI6Imh0dHA6Ly9pc3N1ZXIuY29tIiwiYXVkIjoiaHR0cDovL215c2l0ZS5jb20ifQ.WD16D9C1-R6Ue1w6nX6pLK1oT0QkGxPlsd0aibr4V8UUpwQRcbKzldViDq6ygpLA_te4rAYo62E_fC2xt32N1JY8cfEO9TPOf_h1xXAzq-IV_asb7OvRQrW2r_gr7DXU3KBr2aAmJnKPETCGSXKnf5xFiVfDT0EVbP0_UoFGcqAM5Ub9N16VKJVctcq79qTSb7erJKPx2mUcSr-YPImgPMuVBe8xppF_4CGCCM0WsCHAU0JJbHWh17Jgyn9kIQHYRcLG_hRL_YVmEnsmTxrRP6VAWJHwft0cJrQ9hlfvdZmBiv34DByX1B2coNbnn5cl5eKbX2B-C2rO_Z7ofj-yUw'
                }
            }
            axios.get('http://54.224.61.111/Ljm_Service_Manager/api/archivo/get/968', options)
            .then( response => {
                let result = response.data;

                fs.writeFile('testfile.pdf',"data:application/pdf;base64," + new Buffer(result), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });

                res.status(200).send({ file: result });
            })
            .catch( e => {
                console.log(e);
                res.status(404).send({ message: 'Error al cargar archivo', error: e });
            });
            // (data.map(t => t.area_name))
        } catch (err) {
            res.status(500).send({ message: 'Error Interno - Al cargar archivo', error: err });
        }
    }

    public async getCertificadoLote(req: Request, res: Response) {
        let params = req.params;
        const result = await lotesController.getLote_Message(parseInt(params.idlote), params.lote, parseInt(params.idcertificado))
        if (result.status == 200) {
            const dataLote = result.data;
            let split_lote = dataLote.strLote.split('-');
            let type_company = (split_lote[0]=='LJ' || split_lote[0]=='AS') ? 'LJM' : 'LJC';
            let name_company = (type_company === 'LJM') ? 'Joya Mining S.A.C.' : 'Joya Comercial S.A.C.';
            let ruc_company = (type_company === 'LJM') ? '20539627938' : '20606143487';
            //let dir_company = (type_company === 'LJM') ? 'Av. Variante de Uchumayo Km 1.5' : 'Av. Variante de Uchumayo Km 1.5';
            let dir_company = (type_company === 'LJM') ? 'Edf. City Center Torre Sur Of. 216' : 'Edf. City Center Torre Sur Of. 216';
            let distr_company = (type_company === 'LJM') ? 'Cerro Colorado - Arequipa - Perú' : 'Cerro Colorado - Arequipa - Perú';
            let logo_company = (type_company === 'LJM') ? 'logo_mining.jpg' : 'logo_comercial.jpg';

            const URL_QR = `http://54.224.61.111:3977/api/lotes/certificado/get/${params.idlote}/${params.lote}/1`;
            const qrCodeData = await qrcode.toDataURL(URL_QR);
            
            const doc = new PDFDocument({ size: 'A4' });
            doc.image('./uploads/images/'+ logo_company, 425, 38, { fit: [100, 100] }); // Logo Superior
            doc.image('./uploads/images/'+ logo_company, 70, 735, { fit: [100, 100] }); // Logo Inferior
            doc.moveDown();
        
            // Datos de la Muestra
            doc.fontSize(13).font('Helvetica-Bold').text('INFORME DE ANALISIS QUIMICO - N°'+ dataLote.intIdRegistro, { align: 'center' });
            doc.moveDown();
            doc.fontSize(10);
            doc.text('NUMERO DE CODIGO', 85, 130, { width: 130 });
            doc.text('CLIENTE / EMPRESA', 85, 145, { width: 130 });
            doc.text('CANTIDAD DE MUESTRAS', 85, 160, { width: 130 });
            doc.text('DETALLE DEL ENVASE', 85, 175, { width: 130 });
            doc.text('TIPO DE MUESTRA', 85, 190, { width: 130 });
            doc.text('FECHA DE RECEPCION', 85, 205, { width: 130 });
            doc.text('FECHA DE ENSAYO', 85, 220, { width: 130 });
            doc.text('METODO ANALITICO', 85, 235, { width: 130 });
            doc.font('Helvetica');
            doc.text(': '+ dataLote.strLote, 250, 130, { width: 200 });
            doc.text(': '+ dataLote.strProveedor, 250, 145, { width: 250 });
            doc.text(': 01', 250, 160, { width: 200 });
            doc.text(': SOBRE CERRADO CODIFICADO', 250, 175, { width: 200 });
            doc.text(': MINERAL', 250, 190, { width: 200 });
            doc.text(': '+ dataLote.strFechaRecepcion, 250, 205, { width: 200 });
            doc.text(': '+ dataLote.strFechaRecepcion, 250, 220, { width: 200 });
            doc.text(': VIA SECA', 250, 235, { width: 200 });
        
            // Resultados
            doc.moveDown();
            doc.moveDown();
            doc.fontSize(13).font('Helvetica-Bold').text('RESULTADOS', 85, 285, { align: 'center' });
            doc.moveDown();
            doc.fontSize(10);
            doc.text('Au - Oro (g/tm)', 85, 330, { width: 130 });
            doc.text('Au - Oro (onz/tc)', 85, 345, { width: 130 });
            doc.text('Ag - Plata (g/tm)', 85, 360, { width: 130 });
            doc.text('Ag - Plata (onz/tc)', 85, 375, { width: 130 });
            doc.text('Humedad (H2O %)', 85, 390, { width: 130 });
            doc.font('Helvetica');
            doc.text(': '+ lotesController.getFormatNumber(Number(dataLote.strLeyAuReportada)*34.28, 3), 250, 330, { width: 200 });
            doc.text(': '+ lotesController.getFormatNumber(dataLote.strLeyAuReportada, 3), 250, 345, { width: 200 });
            doc.text(': '+ lotesController.getFormatNumber(Number(dataLote.strLeyAgReportada)*34.28, 3), 250, 360, { width: 200 });
            doc.text(': '+ lotesController.getFormatNumber(dataLote.strLeyAgReportada, 3), 250, 375, { width: 200 });
            doc.text(': '+ lotesController.getFormatNumber(dataLote.strH2oReportada, 2), 250, 390, { width: 200 });
        
            doc.fontSize(10).font('Helvetica-Bold').text('1 Onza/Tc: 34.28 Gramos', 85, 412, { width: 200 });
            doc.moveDown();

            doc.font('Helvetica-Oblique');
            doc.text('Este informe no debe reproducirse total ni parcial sin autorizacion de la '+name_company+' Los resultados de este certificado corresponden a la muestra recibida en laboratorio según código descrito en el informe.', 70, 650, { width: 430 });
        
            doc.font('Helvetica').fontSize(9);
            doc.text('RUC : '+ ruc_company, 200, 735, { width: 200 });
            doc.text('Oficina : '+ dir_company, 200, 745, { width: 200 });
            doc.text(distr_company, 200, 755, { width: 200 });
        
            doc.image('./uploads/images/firma_lab.png', 247, 450, { fit: [130, 130], align: 'center' }); // Firma Laboratorio
        
            doc.moveDown();
            doc.image(qrCodeData, 435, 700, { fit: [100, 100] }); // Agrega el código QR al documento
        
            // Cuadros Titulos
            doc.lineJoin('miter').rect(70, 120, 455, 132).stroke();
            doc.lineJoin('miter').rect(70, 320, 455, 85).stroke();
            doc.lineJoin('miter').rect(70, 80, 455, 20).stroke();
            doc.lineJoin('miter').rect(70, 280, 455, 20).stroke().fillAndStroke("#fff", "#900");


            const name_file = 'Certificado-'+ split_lote[1] +'.pdf';
            res.setHeader('Content-Disposition', 'attachment; filename='+ name_file);
            res.setHeader('Content-Type', 'application/pdf');
        
            doc.pipe(res);
            doc.end();
            // res.status(200).send({ message: 'Certificado Generado', check: result.data });
        } else {
            res.status(result.status).send({ message: result.message }); // error: result.error
        }
    }

    public async getLote_Message(idRegistro: number, Lote: string, idCertificado: number) {
        try {
            // const options = {
            //     headers: {
            //         'Authorization': 'bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiVVNVMDAwMDAwMDAxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJQRVIwMDAwMDAwMDEiLCJleHAiOjE2ODYzNjY0MjAsImlzcyI6Imh0dHA6Ly9pc3N1ZXIuY29tIiwiYXVkIjoiaHR0cDovL215c2l0ZS5jb20ifQ.JcIQbbx9dzNIyuVFD4-lSc-qoJGYD14bzYOJVrNf7ArzRtGKT6l6d_VUqayMqzvqVCHEKzNzaqJcca8IqU80paR2ecwrphGv06I_xeyW9Z6F-0wRVE1BbYK66xXnQaED80f7a3TANgy-zH9J3LK-vmB1VRfolKZhOCunOr65_Ek74Dbi47tszj9rG7gVM6-RLnXEyS6idUuiJG8T_o044nJS39ACYVGb5N_Jyj77j4BszsX-LApD8bxf7dnavdWtXntT-tMGSYXxk9tHqXhIXTmNSToe8_DUKk_NL0pml2N13B8pfsgXbtFx7Bg-j1R8ZYT4Ain78xWX4c5ZFu3EXA'
            //     }
            // }
            const data: any = {
                intIdRegistro: idRegistro,
                strLote: Lote,
                intIdCertificado: idCertificado
            }
            const dataLote = await axios.post(api_url_sig + 'trazabilidad/lotes/get-lote?partnerName=' + partner_name + '&credential=' + credential, data)
            if (dataLote.data == null) {
                return { status: 404, data: null, message: 'No se encontro el registro enviado!' }
            } else {
                return { status: 200, data: dataLote.data, message: 'Datos obtenidos correctamente!' }
            }
        } catch (err) {
            return { status: 500, message: 'Error Interno - Al obtener datos del Lote', error: err };
        }
    }

    public getFormatNumber(numero: number, fix: number) {
        let exp = numero || 0;
        return exp.toLocaleString('es-PE', {
          minimumFractionDigits: fix,
          maximumFractionDigits: fix
        });
    }
}
export const lotesController = new LotesController();