import { vsmObjectTypes } from "../../types/vsmObjectTypes";

export const projectTemplatesV1 = {
  experimental: {},
  kitchenSink: {
    name: "Welcome to the KitchenSink",
    objects: [
      {
        parent: 0,
        name: "KitchenSink",
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier, name: "supplier" },
          { FkObjectType: vsmObjectTypes.input, Name: "input" },
          {
            FkObjectType: vsmObjectTypes.mainActivity,
            Name: "Choose method",
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.choice,
                Name: "Kaffetrakter eller presskanne?",
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
  },
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
  joshProject: {
    objects: [
      {
        parent: 0,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier },
          { fkObjectType: vsmObjectTypes.input },
          {
            fkObjectType: vsmObjectTypes.mainActivity,
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.subActivity,
                childObjects: [
                  {
                    fkObjectType: vsmObjectTypes.choice,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.waiting,
                      },
                      {
                        fkObjectType: vsmObjectTypes.subActivity,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { fkObjectType: vsmObjectTypes.output },
          { fkObjectType: vsmObjectTypes.customer },
        ],
      },
    ],
  },
  slalomProject: {
    objects: [
      {
        parent: 0,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier },
          { fkObjectType: vsmObjectTypes.input },
          {
            fkObjectType: vsmObjectTypes.mainActivity,
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.choice,
                childObjects: [
                  { fkObjectType: vsmObjectTypes.subActivity },
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          { fkObjectType: vsmObjectTypes.subActivity },
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                    childObjects: [
                                      {
                                        fkObjectType: vsmObjectTypes.choice,
                                        childObjects: [
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                          },
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                            childObjects: [
                                              {
                                                fkObjectType:
                                                  vsmObjectTypes.choice,
                                                childObjects: [
                                                  {
                                                    fkObjectType:
                                                      vsmObjectTypes.subActivity,
                                                    childObjects: [
                                                      {
                                                        fkObjectType:
                                                          vsmObjectTypes.choice,
                                                        childObjects: [
                                                          {
                                                            fkObjectType:
                                                              vsmObjectTypes.subActivity,
                                                          },
                                                          {
                                                            fkObjectType:
                                                              vsmObjectTypes.subActivity,
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                  {
                                                    fkObjectType:
                                                      vsmObjectTypes.subActivity,
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  { fkObjectType: vsmObjectTypes.subActivity },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { fkObjectType: vsmObjectTypes.output },
          { fkObjectType: vsmObjectTypes.customer },
        ],
      },
    ],
  },
  niceChoicesProject: {
    objects: [
      {
        parent: 0,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier },
          { fkObjectType: vsmObjectTypes.input },
          {
            fkObjectType: vsmObjectTypes.mainActivity,
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.choice,
                childObjects: [
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { fkObjectType: vsmObjectTypes.output },
          { fkObjectType: vsmObjectTypes.customer },
        ],
      },
    ],
  },
  uglyChoicesProject: {
    objects: [
      {
        parent: 0,
        fkObjectType: vsmObjectTypes.process,
        childObjects: [
          { fkObjectType: vsmObjectTypes.supplier },
          { fkObjectType: vsmObjectTypes.input },
          {
            fkObjectType: vsmObjectTypes.mainActivity,
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.choice,
                childObjects: [
                  { fkObjectType: vsmObjectTypes.subActivity },
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          { fkObjectType: vsmObjectTypes.subActivity },
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  { fkObjectType: vsmObjectTypes.subActivity },
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                    childObjects: [
                                      {
                                        fkObjectType: vsmObjectTypes.choice,
                                        childObjects: [
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                          },
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            fkObjectType: vsmObjectTypes.mainActivity,
            childObjects: [
              {
                fkObjectType: vsmObjectTypes.choice,
                childObjects: [
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  {
                                    fkObjectType: vsmObjectTypes.subActivity,
                                    childObjects: [
                                      {
                                        fkObjectType: vsmObjectTypes.choice,
                                        childObjects: [
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                          },
                                          {
                                            fkObjectType:
                                              vsmObjectTypes.subActivity,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  { fkObjectType: vsmObjectTypes.subActivity },
                                ],
                              },
                            ],
                          },
                          { fkObjectType: vsmObjectTypes.subActivity },
                        ],
                      },
                    ],
                  },
                  {
                    fkObjectType: vsmObjectTypes.subActivity,
                    childObjects: [
                      {
                        fkObjectType: vsmObjectTypes.choice,
                        childObjects: [
                          {
                            fkObjectType: vsmObjectTypes.subActivity,
                            childObjects: [
                              {
                                fkObjectType: vsmObjectTypes.choice,
                                childObjects: [
                                  { fkObjectType: vsmObjectTypes.subActivity },
                                  { fkObjectType: vsmObjectTypes.subActivity },
                                ],
                              },
                            ],
                          },
                          { fkObjectType: vsmObjectTypes.subActivity },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { fkObjectType: vsmObjectTypes.output },
          { fkObjectType: vsmObjectTypes.customer },
        ],
      },
    ],
  },
};
