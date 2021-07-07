import { vsmObjectTypes } from "../types/vsmObjectTypes";

export const projectTemplatesV1 = {
  defaultProject: {
    objects: [
      {
        parent: 0,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier },
          { fkObjectType: vsmObjectTypes.input },
          { fkObjectType: vsmObjectTypes.mainActivity },
          { fkObjectType: vsmObjectTypes.output },
          { fkObjectType: vsmObjectTypes.customer },
        ],
      },
    ],
  },
  devOpsExample: {
    name: "DevOps Team Process",
    objects: [
      {
        parent: 0,
        name: "DevOps Team Process",
        fkObjectType: 1,
        childObjects: [
          { name: "https://flyt.equinor.com/projects/83", fkObjectType: 2 },
          { name: "Bugs & New feature requests.", fkObjectType: 3 },
          {
            name: "Prepare tasks ",
            childObjects: [
              {
                name: "Add new Bugs & Feature requests to our backlog",
                fkObjectType: 5,
              },
              {
                name: "Prioritize by moving what we want to focus on to the selected column",
                fkObjectType: 5,
              },
              {
                name: "Fill in necessary user-story and implementation details.\n\n",
                fkObjectType: 5,
              },
              {
                name: "Missing design?",
                childObjects: [
                  { name: "No", choiceGroup: "Left", fkObjectType: 5 },
                  {
                    name: "Yes -> Add design subtask and assign a designer.",
                    choiceGroup: "Right",
                    fkObjectType: 5,
                  },
                  {
                    name: "Design UI/UX",
                    choiceGroup: "Right",
                    fkObjectType: 5,
                  },
                  {
                    name: "Update parent-task with design info / link.",
                    choiceGroup: "Right",
                    fkObjectType: 5,
                  },
                  {
                    name: "Move task to Ready column",
                    choiceGroup: "Right",
                    fkObjectType: 5,
                  },
                  {
                    name: "Move task to Ready column",
                    choiceGroup: "Left",
                    fkObjectType: 5,
                  },
                ],
                fkObjectType: 10,
              },
            ],
            fkObjectType: 4,
          },
          {
            name: "Code - Implement changes",
            childObjects: [
              {
                name: "Front-end or Back-end?",
                childObjects: [
                  {
                    name: "Front-End | WEB\n\nCode the changes",
                    choiceGroup: "Left",
                    fkObjectType: 5,
                  },
                  {
                    name: "Back-end | API\nCode the changes",
                    choiceGroup: "Right",
                    fkObjectType: 5,
                  },
                  {
                    name: "Build to Test environment\n\n$yarn release-test",
                    choiceGroup: "Left",
                    fkObjectType: 5,
                  },
                ],
                fkObjectType: 10,
              },
              { name: "Move task to Test column", fkObjectType: 5 },
            ],
            fkObjectType: 4,
          },
          {
            name: "Test & QA",
            childObjects: [
              { name: "Test the code in test environment", fkObjectType: 5 },
              { name: "Promote to QA", fkObjectType: 5 },
              { name: "Notify POs?", fkObjectType: 5 },
            ],
            fkObjectType: 4,
          },
          {
            name: "Release",
            childObjects: [
              {
                name: "Check with developers that we are good to go.",
                fkObjectType: 5,
              },
              {
                name: "Promote QA environment to Production",
                fkObjectType: 5,
              },
              { name: "Notify PO & users?", fkObjectType: 5 },
            ],
            fkObjectType: 4,
          },
          {
            name: "New feature, bug fix or improvement deployed to flyt.equinor.com",
            fkObjectType: 8,
          },
          { name: "Flyt users", fkObjectType: 9 },
        ],
      },
    ],
  },
};
