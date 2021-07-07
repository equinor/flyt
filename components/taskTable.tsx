import { taskObject } from "../interfaces/taskObject";
import React from "react";

export default function TaskTable({
  tasks,
}: {
  tasks: Array<taskObject>;
}): JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          {Object.keys(tasks[0]).map((k) => {
            return <th key={k.toString()}>{k}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          return (
            <tr key={task.vsmTaskID}>
              {Object.keys(task).map((k) => {
                return (
                  <td key={`${k}-${task.vsmTaskID}`}>
                    {task && task[k] && task[k].toString()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
