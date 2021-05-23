import { CommandMeta } from './command-meta';
import { ModelUnitMeta } from './model-unit-meta';
import { parseCommands } from './parse-commands';
import { RelationMeta } from './relation-meta';
import { WhereMeta } from './where-meta';

const TOKEN_MODEL = 'model';
const TOKEN_WHERE = 'where';
const TOKEN_OR_WHERE = 'orWhere';

export class MagicQueryParamsParser {
  private json: any;
  modelUnit: ModelUnitMeta;
  takeCommand = 'getMany';
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
  whereMeta: WhereMeta;

  constructor(jsonStr: string) {
    this.json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this.json) {
      const [key, commands] = parseCommands(keyStr);
      switch (key.toLowerCase()) {
        case TOKEN_MODEL:
          this.modelUnit = new ModelUnitMeta(key, commands, this.json[keyStr]);
          break;
        default:

      }
    }
  }
}
