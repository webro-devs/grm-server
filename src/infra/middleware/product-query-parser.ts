import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Between, Equal, ILike, In, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { ProductQueryDto } from '../shared/dto';

@Injectable()
class ProductQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    let {
      startDate,
      endDate,
      startPrice,
      endPrice,
      style,
      size,
      shape,
      color,
      collectionId,
      modelId,
      filialId,
      partiyaId,
      isMetric,
      search,
      isInternetShop,
    }: ProductQueryDto = req.query;

    if (startDate && endDate) {
      where = {
        date: Between(new Date(startDate), new Date(endDate)),
      };
    } else if (startDate) {
      where = {
        date: MoreThanOrEqual(new Date(startDate)),
      };
    } else if (endDate) {
      where = {
        date: LessThanOrEqual(new Date(endDate)),
      };
    }
    if (startPrice && endPrice) {
      where = {
        price: Between(startPrice, endPrice),
      };
    } else if (startPrice) {
      where = {
        price: MoreThanOrEqual(startPrice),
      };
    } else if (endPrice) {
      where = {
        price: LessThanOrEqual(endPrice),
      };
    }

    if (style) {
      const ddd = JSON.parse(style);
      where.style = In(ddd);
      if (ddd.length == 0) {
        delete where.style;
      }
    }

    if (size?.length) {
      let ddd = JSON.parse(size);
      where.size = In(ddd);
      if (ddd.length == 0) {
        delete where.size;
      }
    }

    if (shape) {
      let ddd = JSON.parse(shape);
      where.shape = In(ddd);
      if (ddd.length == 0) {
        delete where.shape;
      }
    }

    if (color) {
      const ddd = JSON.parse(color);
      where.color = { title: In(ddd) };
      if (ddd.length == 0) {
        delete where.color;
      }
    }

    if (collectionId) {
      where.model = {
        collection: {
          id: collectionId,
        },
      };
    }

    if (modelId) {
      where.model = { id: modelId };
    }

    if (filialId) {
      where.filial = {
        id: filialId,
      };
    }

    if (partiyaId) {
      where.partiya = {
        id: partiyaId,
      };
    }

    if (isInternetShop) {
      where.isInternetShop = isInternetShop;
    }

    if (isMetric) {
      where.isMetric = true;
    }
    where.count = MoreThanOrEqual(1);

    if (search) {
      search = search.split('+').join(' ');
      where = {
        filial: filialId,
        search,
        fields: true,
      };
    }

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default ProductQueryParserMiddleware;
