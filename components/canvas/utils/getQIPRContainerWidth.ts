export const getQIPRContainerWidth = (numTasks: number): number =>
  numTasks > 0 ? (((numTasks / 4.000001) >> 0) + 1) * 33 + 2.5 : 0; // 33 = QIPR circle width. 2.5 = margin
