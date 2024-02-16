import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Between, Equal, ILike, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
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
      where.style = In(style);
    }

    if (size?.length) {
      where.size = In(size);
    }

    if (shape) {
      where.shape = In(shape);
    }

    if (color) {
      where.color = { title: In(color) };
    }

    if (collectionId) {
      where.model = {
        collection: {
          id: collectionId,
        },
      };
    }

    if (modelId) {
      where.model = where?.model || {};
      where.model.id = modelId;
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

    if (search) {
      search = search.split('+').join(' ');
      where = [
        { filial: { id: Equal(filialId) } },
        [
          { size: ILike(`%${search}%`) },
          { shape: ILike(`%${search}%`) },
          { model: { collection: { title: ILike(`%${search}%`) } } },
          { model: { title: ILike(`%${search}%`) } },
        ],
      ];
    }

    where.count = MoreThanOrEqual(1);

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default ProductQueryParserMiddleware;
