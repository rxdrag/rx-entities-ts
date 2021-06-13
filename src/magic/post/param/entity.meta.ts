import { JsonUnit } from 'src/magic/base/json-unit';
import { getRelationModel } from '../../base/getRelationModel';
import { RelationMetaCollection } from './relation.meta.colletion';

export class EntityMeta {
  private _meta: any = {};
  private _relations: { [key: string]: RelationMetaCollection } = {};
  private _savedRelasions: { [key: string]: any } = {};
  private _model: string;
  private _json: any;

  constructor(model: string, json: any) {
    this._model = model;
    this._json = json;
    for (const keyStr in this._json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);

      const relationModel = getRelationModel(jsonUnit.key, model);
      if (relationModel) {
        this._relations[jsonUnit.key] = new RelationMetaCollection(
          relationModel,
          jsonUnit,
        );
      } else {
        this._meta[keyStr] = value;
      }
    }
  }

  get meta() {
    return this._meta;
  }

  get model() {
    return this._model;
  }

  get relations() {
    return this._relations;
  }

  get savedRelations() {
    return this._savedRelasions;
  }
}
