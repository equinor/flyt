import React from "react";

export function ObjectTable({ vsmObjects }: { vsmObjects }): JSX.Element {
  if (vsmObjects && vsmObjects.length > 0) {
    return (
      <table>
        <thead>
          <tr>
            {Object.keys(vsmObjects[0]).map((k) => {
              return <th key={k.toString()}>{k}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {vsmObjects.map((o) => {
            return (
              <tr key={o.vsmObjectID}>
                {Object.keys(o).map((k) => {
                  return (
                    <td key={`${k}-${o.vsmObjectID}`}>
                      {o && o[k] && o[k].toString()}
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
  return <p>No vsmObjects</p>;
}
