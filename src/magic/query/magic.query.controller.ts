import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { createId } from 'src/utils/create-id';
import { MagicQueryService } from './magic.query.service';
import { sleep } from './sleep';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

@Controller()
export class MagicQueryController {
  constructor(private readonly queryService: MagicQueryService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "model":"User @count  @getOne",//@getMany, @sum(ddd) as xx, @skip(100), @take(10) @paginate(25,0)
   *    "id":1,
   *    "select":["*", "photosCount"],
   *    "age @between":[18, 40], //@IN
   *    "where":"name @like:'%风%' and id<>'5' or ('xx'=6 and 'tt'=7)"
   *    #LargeRelation功能暂时不实现
   *    "roles @count @take(5, LargeRelation) @toUpercase(name)":{
   *      "active": true,
   *      "isRemoved": false,
   *      "orderBy":{"name":'ASC'},
   *      "on":"name @like:'%风%' and id<>'5' or ('xx'=6 and 'tt'=7)"
   *    },
   *    "orderBy":{
   *      "name":"ASC",
   *      "xxx" : "DESC",
   *      "ddd" : "ASC"
   *    },
   *    select:["name", "nn"],
   * }
   * 关系嵌套：文章与图片
   * {
   *    "model":"Post",
   *    "images @relation(PostImage)":{
   *      "media @relation(Media)":{
   *      }
   *    }
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  //@UseGuards(AuthGuard())
  @Get('get/:jsonStr?')
  async getModels(@Param('jsonStr') jsonStr) {
    try {
      console.debug('JSON QUERY String', jsonStr);
      const sql =
        "(name = 'Shaun Persad' AND age >= 27) OR (name like '%xx%' and id in (1,2,3,4))";
      const parser = new SqlWhereParser();
      const params = {} as any;
      const parsed = parser.parse(sql, (operatorValue, operands) => {
        if (operatorValue === OPERATOR_UNARY_MINUS) {
          operatorValue = '-';
        }
        if (operatorValue === ',') {
          return [].concat(operands[0], operands[1]);
        }

        const paramName = `param${createId()}`;

        switch (operatorValue) {
          case 'OR':
            return `(${operands.join(' OR ')})`;
          case 'AND':
            return `(${operands.join(' AND ')})`;
          default:
            params[paramName] = operands[1];
            return `${operands[0]} ${operatorValue} :${paramName}`;
        }
      });
      console.log('哈哈', parsed, params);

      await sleep(500);
      return await this.queryService.query(jsonStr);
    } catch (error: any) {
      console.error('getModels error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }
}
