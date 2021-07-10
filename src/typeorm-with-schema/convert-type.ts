import { ColumnType as MetaColumnType } from 'src/meta/entity/column-type';
import { ColumnType } from 'typeorm';

export function convertType(type: MetaColumnType): ColumnType {
  if (type === MetaColumnType.String) {
    return String;
  }

  if (type === MetaColumnType.Boolean) {
    return Boolean;
  }

  if (type === MetaColumnType.Number) {
    return Number;
  }

  if (type === MetaColumnType.Date) {
    return Date;
  }

  if (type === MetaColumnType.SimpleJson) {
    return 'simple-json';
  }

  if (type === MetaColumnType.SimpleArray) {
    return 'simple-array';
  }
}