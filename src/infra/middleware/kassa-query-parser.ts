import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class KassaQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let { startDate, endDate, filial, total, isActive } = req.query;

    if (startDate) {
      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);
      where.startDate = MoreThanOrEqual(startDate)
    }

    if (endDate) {
      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999);
      where.endDate = LessThanOrEqual(endDate)
    }
    if (filial)
      where.filial = {
        id: filial,
      };

    if (total) where.total = true;

    if (isActive === 'true' || isActive === 'false') where.isActive = JSON.parse(isActive);

    req.where = where;
    next();
  }
}

export default KassaQueryParserMiddleware;