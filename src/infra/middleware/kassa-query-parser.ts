import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class KassaQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    const { startDate, endDate, filial, total } = req.query;

    if (startDate && endDate) {
      where = {
        startDate: Between(
          (new Date(startDate)).setHours(0, 0, 0, 0),
          (new Date(endDate)).setHours(23, 59, 59, 999),
        ),
      };
    } else if (startDate) {
      where = {
        startDate: MoreThanOrEqual((new Date(startDate)).setHours(0, 0, 0, 0)),
      };
    } else if (endDate) {
      where = {
        startDate: LessThanOrEqual((new Date(endDate)).setHours(23, 59, 59, 999)),
      };
    }
    if (filial) {
      where.filial = {
        id: filial,
      };
    }
    if (total) {
      where.total = true;
    }

    req.where = where;
    next();
  }
}

export default KassaQueryParserMiddleware;
