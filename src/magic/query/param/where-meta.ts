import { ConditionMeta } from './condition-meta';

export class WhereMeta {
  conditions: ConditionMeta[];
  andMetas: WhereMeta[];
  orMetas: WhereMeta[];
}