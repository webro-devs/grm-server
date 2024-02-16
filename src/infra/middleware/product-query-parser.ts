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
      where.style = In(JSON.parse(style));
    }

    if (size?.length) {
      where.size = In(JSON.parse(size));
    }

    if (shape) {
      where.shape = In(JSON.parse(shape));
    }

    if (color) {
      where.color = { title: In(JSON.parse(color)) };
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

    if (isMetric) {
      where.isMetric = true;
    }
    where.count = MoreThanOrEqual(1);

    if (search) {
      search = search.split('+').join(' ');
      where = {
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
