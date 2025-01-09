import { Json } from './json';
import { DatabaseTables } from './tables';
import { DatabaseFunctions } from './functions';
import { DatabaseEnums } from './enums';

export type Database = {
  public: {
    Tables: DatabaseTables;
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
  };
};