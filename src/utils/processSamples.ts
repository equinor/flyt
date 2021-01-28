import { vsmObjectTypes } from "./VsmObjectTypes";
import { vsmProcessObject } from "./VsmProcessObject";

export const simpleProcess = {
  name: "Project name",
  objects: [
    {
      parent: 0,
      name: "Process name",
      fkObjectType: vsmObjectTypes.process,
      childObjects: [
        { fkObjectType: vsmObjectTypes.supplier, name: "supplier" },
        { fkObjectType: vsmObjectTypes.input, Name: "input" },
        { fkObjectType: vsmObjectTypes.mainActivity, name: "main activity" },
        { fkObjectType: vsmObjectTypes.output, name: "output" },
        { fkObjectType: vsmObjectTypes.customer, name: "customer" },
      ],
    },
  ],
} as vsmProcessObject;

export const kitchenSink = {
  name: "Project name",
  objects: [
    {
      parent: 0,
      name: "Process name",
      fkObjectType: vsmObjectTypes.process,
      childObjects: [
        { fkObjectType: vsmObjectTypes.supplier, name: "supplier" },
        { FkObjectType: vsmObjectTypes.input, Name: "input" },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Choose method",
          childObjects: [
            {
              name: "Kaffetrakter",
              fkObjectType: vsmObjectTypes.subActivity,
            },
            {
              name: "Presskanne",
              fkObjectType: vsmObjectTypes.subActivity,
              childObjects: [
                {
                  name: "Finn presskanne",
                  fkObjectType: vsmObjectTypes.subActivity,
                },
              ],
            },
          ],
        },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Boil water",
          childObjects: [
            {
              name: "Tilsett kaffe til presskanne",
              fkObjectType: vsmObjectTypes.subActivity,
            },
          ],
        },
        {
          FkObjectType: vsmObjectTypes.waiting,
          Name: "Waiting",
        },
        {
          FkObjectType: vsmObjectTypes.mainActivity,
          Name: "Add water",
          childObjects: [
            {
              name: "Waiting",
              fkObjectType: vsmObjectTypes.waiting,
              childObjects: [
                {
                  name: "Press kaffe",
                  fkObjectType: vsmObjectTypes.subActivity,
                  childObjects: [
                    {
                      name: "Pour coffee",
                      fkObjectType: vsmObjectTypes.subActivity,
                    },
                  ],
                },
              ],
            },
          ],
        },
        { fkObjectType: vsmObjectTypes.output, name: "output" },
        { fkObjectType: vsmObjectTypes.customer, name: "customer" },
      ],
    },
  ],
} as vsmProcessObject;
