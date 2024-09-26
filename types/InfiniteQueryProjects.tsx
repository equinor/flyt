import { UseInfiniteQueryResult } from "react-query";
import { Project } from "./Project";

export type InfiniteQueryProjects = UseInfiniteQueryResult<{
  projects: Project[];
  totalItems: number;
}>;
