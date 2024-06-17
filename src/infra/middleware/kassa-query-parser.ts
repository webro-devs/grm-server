import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class KassaQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let { startDate, endDate, filial, total } = req.query;

    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      where = {
        startDate: Between(
          (new Date(startDate)).setHours(0, 0, 0, 0),
          (new Date(endDate)).setHours(23, 59, 59, 999),
        ),
      };
    } else if (startDate) {
      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);

      where = {
        startDate: MoreThanOrEqual((new Date(startDate)).setHours(0, 0, 0, 0)),
      };
    } else if (endDate) {
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
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
