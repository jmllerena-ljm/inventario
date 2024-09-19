import {Request, Response} from 'express';
import { seqlz } from '../keys';

class ProductoController {
    public async getOdooProducts(req: Request, res: Response) {
        let count = parseInt(req.params.count);
        let page = (req.params.page) ? (parseInt(req.params.page) - 1) : 0;
        const skip = page * count;        
        let _name = '%'+req.body.name+'%';
        let _code = '%'+req.body.code+'%';
        seqlz.query("SELECT * FROM product_product WHERE (name_template ILIKE :name) AND (default_code ILIKE :code) ORDER BY id LIMIT :limit OFFSET :offset",
        { replacements: { name: _name, code: _code, limit: count, offset: skip}, type: seqlz.QueryTypes.SELECT })
        .then((products: any) => {
            res.status(200).send({ Data: products, Count: products.length })
        })
    }
}
export const productoController = new ProductoController();