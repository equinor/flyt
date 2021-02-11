import { vsmObjectTypes } from '../types/vsmObjectTypes';
import { vsmTaskTypes } from '../types/vsmTaskTypes';

export interface vsmObject {
  vsmObjectID: number;
  vsmProjectID?: number;
  parent?: number;
  name: string;
  fkObjectType?: number;
  time: number;
  role: string;
  childObjects?: Array<vsmObject>;
  vsmObjectType?: {
    'pkObjectType': vsmObjectTypes,
    'name': string,
    'description': null,
    'hidden': boolean,
  };
  tasks?: []
  created?: {
    'pkChangeLog': number,
    'userIdentity': string,
    'changeDate': string,
    'fkVsm': number,
    'fkObject': vsmObjectTypes,
    'fkTask': vsmTaskTypes,
  };
  lastUpdated?: {
    'pkChangeLog': number,
    'userIdentity': string,
    'changeDate': string,
    'fkVsm': number,
    'fkObject': vsmObjectTypes,
    'fkTask': vsmTaskTypes,
  };
}
