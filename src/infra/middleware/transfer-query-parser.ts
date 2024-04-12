import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TransferQueryDto } from '../shared/dto';

@Injectable()
class TransferQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    const { startDate, endDate, size, collectionId, from, type, to, progress }: TransferQueryDto = req.query;

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

    if (progress) {
      try {
        const transformedData = progress.split('_');
        where.progres = In(transformedData);
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }

    if(type){
      where.type = type;
    }

    if (from) {
      where.from = from;
    }

    if (to) {
      where.to = to;
    }

    req.where = where;
    req.relations = relations;
    next();
  }
}

export default TransferQueryParserMiddleware;
