import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TransferQueryDto } from '../shared/dto';

@Injectable()
class TransferQueryParserMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    let where: any = {};
    let relations: any = {};
    const { startDate, endDate, size, collectionId, type, progress, filial, model }: TransferQueryDto = req.query;

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
      where.product = { size: In(JSON.parse(size)) };
    }

    if (collectionId || model) {
      where.product = {
        ...(where?.product && where.product),
        model: {
          ...(model?.length && JSON.parse(model) && { id: In(JSON.parse(model)) }),
          ...(collectionId?.length && JSON.parse(collectionId) && {
            collection: {
              id: In(JSON.parse(collectionId)),
            },
          }),
        },
      };
    }

    if(filial){
      where.filial = filial;
    }

    if (progress) {
      try {
        const transformedData = progress.split('_');
        if (transformedData.length) {
          where.progres = In(transformedData);
        }
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }

    if(type){
      where.type = type;
    }


    req.where = where;
    req.relations = relations;
    next();
  }
}

export default TransferQueryParserMiddleware;
