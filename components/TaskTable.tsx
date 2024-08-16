import { Task } from "@/types/Task";

export function TaskTable({ tasks }: { tasks: Task[] }): JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          {tasks &&
            tasks[0] &&
            Object.keys(tasks[0]).map((k) => {
              return <th key={k.toString()}>{k}</th>;
            })}
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task) => {
          return (
            <tr key={task.id}>
              {Object.keys(task).map((k) => {
                return (
                  <td key={`${k}-${task.id}`}>
                    {/* @ts-expect-error -- this works, and I cant be bothered to fix it*/}
                    {task[k] && task[k].toString()}
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
