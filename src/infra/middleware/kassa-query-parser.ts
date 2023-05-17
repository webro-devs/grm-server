import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class KassaQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    const { startDate, endDate, filial } = req.query;

    if (startDate && endDate) {
      where = {
        startDate: Between(new Date(startDate), new Date(endDate)),
      };
    } else if (startDate) {
      where = {
        startDate: MoreThanOrEqual(new Date(startDate)),
      };
    } else if (endDate) {
      where = {
        startDate: LessThanOrEqual(new Date(endDate)),
      };
    }
    if (filial) {
      where.filial = {
        id: filial,
      };
    }

    req.where = where;
    next();
  }
}

export default KassaQueryParserMiddleware;
