import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OrderQueryDto } from '../shared/dto';

@Injectable()
class OrderQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    const {
      startDate,
      endDate,
      startPrice,
      endPrice,
      filialId,
      isActive,
      color,
      shape,
      model,
      collection,
      style,
      size,
      kassa,
    }: OrderQueryDto = req.query;

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

    if (filialId) {
      where.product = {
        filial: {
          id: filialId,
        },
      };
    }

    if(isActive){
      where.isActive = isActive;
    }

    if (style) {
      const ddd = JSON.parse(style);
      ddd.length && (where.product = { ...(where.product && where.product), style: { id: In(ddd) } });
    }

    if (kassa) {
      where.kassa = { id: kassa };
    }

    if (size?.length) {
      let ddd = JSON.parse(size);
      ddd.length && (where.product = { ...(where.product && where.product), size: { id: In(ddd) } });
    }

    if (shape) {
      let ddd = JSON.parse(shape);
      ddd.length && (where.product = { ...(where.product && where.product), shape: { id: In(ddd) } });
    }

    if (color) {
      const ddd = JSON.parse(color);
      ddd.length && (where.product = { ...(where.product && where.product), color: { id: In(ddd) } });
    }

    if (collection) {
      const ddd = JSON.parse(collection);
      ddd.length && (where.product = {
        ...(where.product && where.product),
        model: {
          collection: { id: In(ddd) },
        },
      });
    }

    if (model) {
      const ddd = JSON.parse(model);
      ddd.length && (where.product = {
        ...(where.product && where.product),
        model: {
          ...(where?.product?.model && where.product.model),
          id: In(ddd),
        },
      });
    }

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default OrderQueryParserMiddleware;
