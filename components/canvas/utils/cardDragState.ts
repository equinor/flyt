const objectStates = {};
//Data
export const getData = (
  cardId: number
): {
  data: unknown;
  getLocalPosition;
} => {
  return objectStates[cardId].data;
};
export const setData = (cardId: number, data: unknown): void => {
  if (!objectStates[cardId]) objectStates[cardId] = {};
  objectStates[cardId].data = data;
};
//Dragging
export const getDragging = (cardId: number): boolean =>
  objectStates[cardId] && objectStates[cardId].dragging;
export const setDragging = (cardId: number, dragging: boolean): void => {
  if (!objectStates[cardId]) objectStates[cardId] = {};
  objectStates[cardId].dragging = dragging;
};
export const removeObject = (cardId: number): void => {
  delete objectStates[cardId];
};
