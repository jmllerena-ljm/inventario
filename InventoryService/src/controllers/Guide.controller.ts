import {Request, Response} from 'express';
import GuideModel from '../models/tblGuide';
import GuideDetailModel from '../models/tblGuideDetail';

import moment from 'moment';

class GuideController {
  public async searchGuide(req: Request, res: Response) {
    let params = req.body;
    let query_guide: any = {
      number_guide: new RegExp(params.number_guide, "i"),
      status: true
    }
    if(params.date_ini && params.date_fin) {
      query_guide.date = { $gte: "'"+params.date_ini+"'", $lte: "'"+params.date_fin+"'" };
    }
    const guides = await GuideModel.find(query_guide);
    res.status(200).send({ Data: guides });
  }
  public async getGuide(req: Request, res: Response) {
    const idGuide = req.params.id;
    const guide = await GuideModel.findOne({ _id: idGuide, status: true });
    const detail = await GuideDetailModel.find({ guide: idGuide })
    res.status(200).send({ Data: guide, Detail: detail });
  }

  public async saveGuide(req: Request, res: Response) {
    const guide = new GuideModel();
    let params = req.body;

    try {
      guide.number_guide = params.number_guide.trim();
      guide.arrival_point = params.arrival_point;
      guide.carrier_name = params.carrier_name;
      guide.carrier_ruc = params.carrier_ruc;
      guide.constancy_ins = params.constancy_ins;
      guide.date = new Date(moment(params.date).format());
      guide.doc_identify = params.doc_identify;
      guide.license_number = params.license_number;
      guide.number_invoice = params.number_invoice;
      guide.plate_number = params.plate_number;
      guide.receiver = params.receiver;
      guide.starting_point = params.starting_point;
      guide.vehicle_mark = params.vehicle_mark;
      guide.description = '';
      guide.create_user = params.sessionUser.strUsuario;
      guide.create_date = new Date(moment().format());
      guide.update_user = params.sessionUser.strUsuario;
      guide.update_date = new Date(moment().format());
      guide.status = true;
      guide.company = params.company;
  
      let _detail = params.detail;
      
      let guideFind = await GuideModel.findOne({number_guide: guide.number_guide, status: true});
      if(guideFind) {
        res.status(400).send({ message: 'Ya existe una guia con este mismo numero: '+ guide.number_guide });
      } else {
        const guideStored = await guide.save();

        if (!guideStored) {
          res.status(404).send({ message: 'La guia: '+guide.number_guide+', no ha sido guardada.' });
        } else {
          
          for (let i = 0; i < _detail.length; i++) {
            const item = _detail[i];
            let detailGuide = new GuideDetailModel();
            detailGuide.description = item.description;
            detailGuide.unit = item.unit;
            detailGuide.qty = item.qty;
            detailGuide.purchase_order = item.purchase_order;
            detailGuide.number_lic = item.number_lic;
            detailGuide.lic_det_id = item.lic_det_id;
            detailGuide.id_seg_mongo = item.id_seg_mongo;
            detailGuide.guide = guideStored._id;
            await detailGuide.save()
          }
          res.status(200).send({ message: 'Guia guardada N° '+ guide.number_guide + ', puede ver/descargar en el menu "Guias"', Data: guideStored });
        }
      }
    } catch (error) {
      res.status(500).send({ message: 'Error al guardar guia: '+guide.number_guide, error: error });
    }
  }
  public async updateGuide(req: Request, res: Response) {
    let idGuide = req.params.id;
    let update = req.body;
    try {
      await GuideModel.updateOne({ _id: idGuide }, update);
      res.status(200).send({ message: 'Guia actualizada correctamente ', status: true});
    } catch(e) {
      res.status(500).send({ message: 'Error al actualizar', status: false});
    }
  }
}
export const guideController = new GuideController();