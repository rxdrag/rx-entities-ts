import { CommandType } from 'src/command/magic-command';
import { QueryBuilderCommand } from 'src/command/querybuilder-command';
import { CommandMeta } from 'src/magic/base/command-meta';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelPaginateCommand implements QueryBuilderCommand {
  static description = `
    Magic query command, Paginate the results.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_BUILDER_COMMAND;

  static commandName = 'paginate';

  constructor(private readonly commandMeta: CommandMeta) {}

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  get pageSize(): number {
    return parseInt(this.commandMeta.params[0]);
  }

  get pageIndex() {
    return parseInt(this.commandMeta.params[1]);
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    console.assert(
      this.commandMeta.params.length > 0,
      'Too few pagination parmas',
    );
    qb.skip(this.pageSize * this.pageIndex).take(this.pageSize);
    return qb;
  }
}
