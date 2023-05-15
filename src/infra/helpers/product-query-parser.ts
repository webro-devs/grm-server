import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class ProductQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    const {
      startDate,
      endDate,
      startPrice,
      endPrice,
      style,
      size,
      shape,
      color,
    } = req.query;

    if (startDate && endDate) {
      where = {
        created_at: Between(new Date(startDate), new Date(endDate)),
      };
    } else if (startDate) {
      where = {
        created_at: MoreThanOrEqual(new Date(startDate)),
      };
    } else if (endDate) {
      where = {
        created_at: LessThanOrEqual(new Date(endDate)),
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
      where.style = style;
    }
    if (size) {
      where.size = size;
    }
    if (shape) {
      where.shape = shape;
    }
    if (color) {
      where.color = color;
    }

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default ProductQueryParserMiddleware;
