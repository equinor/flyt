// Generated using https://jvilk.com/MakeTypes/ based on json response for process 172. https://flyt.equinor.com/process/172
// Then cleaned up.

export interface Process {
  vsmProjectID: number;
  name: string;
  isFavorite: boolean;
  duplicateOf?: null;
  toBeProcessID?: null;
  currentProcessId?: null;
  objects?: ObjectsEntity[] | null;
  created: CreatedOrLastUpdated;
  lastUpdated: CreatedOrLastUpdated;
  userAccesses?: UserAccessesEntity[] | null;
  labels?: null[] | null;
}
export interface ObjectsEntity {
  vsmObjectID: number;
  vsmProjectID: number;
  parent: number;
  timeDefinition?: null;
  time?: null;
  role?: null;
  position: number;
  choiceGroup?: null;
  childObjects?: ChildObjectsEntity[] | null;
  name: string;
  vsmObjectType: VsmObjectType;
  tasks?: null[] | null;
  created: CreatedOrLastUpdated1;
  lastUpdated: CreatedOrLastUpdated1;
}
export interface ChildObjectsEntity {
  vsmObjectID: number;
  vsmProjectID: number;
  parent: number;
  timeDefinition?: null;
  time?: null;
  role?: null;
  position: number;
  choiceGroup?: null;
  childObjects?: (ChildObjectsEntity | null)[] | null;
  name: string;
  vsmObjectType: VsmObjectType;
  tasks?: (TasksEntity | null)[] | null;
  created: CreatedOrLastUpdated1;
  lastUpdated: CreatedOrLastUpdated1;
}
// export interface ChildObjectsEntity1 {
//   vsmObjectID: number;
//   vsmProjectID: number;
//   parent: number;
//   timeDefinition?: string | null;
//   time?: number | null;
//   role?: string | null;
//   position: number;
//   choiceGroup?: null;
//   childObjects?: (ChildObjectsEntity2 | null)[] | null;
//   name?: string | null;
//   vsmObjectType: VsmObjectType;
//   tasks?: (TasksEntity1 | null)[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
// }
// export interface ChildObjectsEntity2 {
//   vsmObjectID: number;
//   vsmProjectID: number;
//   parent: number;
//   timeDefinition?: string | null;
//   time?: number | null;
//   role?: string | null;
//   position: number;
//   choiceGroup: string;
//   childObjects?: (ChildObjectsEntity3 | null)[] | null;
//   name: string;
//   vsmObjectType: VsmObjectType;
//   tasks?: (TasksEntity2 | null)[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
// }
// export interface ChildObjectsEntity3 {
//   vsmObjectID: number;
//   vsmProjectID: number;
//   parent: number;
//   timeDefinition?: null;
//   time?: null;
//   role: string;
//   position: number;
//   choiceGroup: string;
//   childObjects?: null[] | null;
//   name: string;
//   vsmObjectType: VsmObjectType;
//   tasks?: (TasksEntity3 | null)[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
// }
export interface VsmObjectType {
  pkObjectType: number;
  name: string;
  description?: null;
  hidden: boolean;
}
// export interface TasksEntity3 {
//   vsmTaskID: number;
//   fkTaskType: number;
//   taskType: TaskType;
//   name?: null;
//   description: string;
//   solved?: null;
//   solvedDate?: null;
//   fkProject: number;
//   objects?: null[] | null;
//   categories?: null[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
//   index: number;
//   displayIndex: string;
// }
export interface TaskType {
  vsmTaskTypeID: number;
  name: string;
  description?: null;
}
export interface CreatedOrLastUpdated1 {
  pkChangeLog: number;
  userIdentity?: null;
  changeDate: string;
  fkVsm?: null;
  fkObject?: null;
  fkTask?: null;
}
// export interface TasksEntity2 {
//   vsmTaskID: number;
//   fkTaskType: number;
//   taskType: TaskType;
//   name?: null;
//   description: string;
//   solved?: null;
//   solvedDate?: null;
//   fkProject: number;
//   objects?: null[] | null;
//   categories?: null[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
//   index: number;
//   displayIndex: string;
// }
// export interface TasksEntity1 {
//   vsmTaskID: number;
//   fkTaskType: number;
//   taskType: TaskType;
//   name?: null;
//   description: string;
//   solved?: null;
//   solvedDate?: null;
//   fkProject: number;
//   objects?: null[] | null;
//   categories?: null[] | null;
//   created: CreatedOrLastUpdated1;
//   lastUpdated: CreatedOrLastUpdated1;
//   index: number;
//   displayIndex: string;
// }
export interface TasksEntity {
  vsmTaskID: number;
  fkTaskType: number;
  taskType: TaskType;
  name?: null;
  description: string;
  solved?: null;
  solvedDate?: null;
  fkProject: number;
  objects?: null[] | null;
  categories?: null[] | null;
  created: CreatedOrLastUpdated1;
  lastUpdated: CreatedOrLastUpdated1;
  index: number;
  displayIndex: string;
}
export interface CreatedOrLastUpdated {
  pkChangeLog: number;
  userIdentity: string;
  changeDate: string;
  fkVsm: number;
  fkObject?: null;
  fkTask?: null;
}
export interface UserAccessesEntity {
  accessId: number;
  user: string;
  role: "Admin" | "Contributor" | "Reader";
}
