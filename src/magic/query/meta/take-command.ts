import { SelectQueryBuilder } from 'typeorm';
import { CommandMeta } from '../../base/command-meta';

export class TakeCommand {
  protected _commandMeta: CommandMeta;
  constructor(commandMeta: CommandMeta) {
    this._commandMeta = commandMeta;
  }

  get name() {
    return this._commandMeta.name;
  }

  get params() {
    return this._commandMeta.params;
  }

  get count() {
    return this._commandMeta.getFistNumberParam();
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}