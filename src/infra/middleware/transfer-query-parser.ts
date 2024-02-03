import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TransferQueryDto } from '../shared/dto';

@Injectable()
class TransferQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    const { startDate, endDate, size, collectionId, filialId }: TransferQueryDto = req.query;

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

    if (size?.length) {
      where.product = { size: In(size) };
    }

    if (collectionId) {
      where.product = {
        model: {
          collection: {
            id: collectionId,
          },
        },
      };
    }

    if (filialId) {
      where.product = {
        filial: {
          id: filialId,
        },
      };
    }
    // where.count = MoreThanOrEqual(1);

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default TransferQueryParserMiddleware;
