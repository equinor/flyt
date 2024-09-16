import { NodeDataApiRequestBody } from "@/types/NodeDataApi";

const isNodeDataApiRequestBody = (obj: any): obj is NodeDataApiRequestBody => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.type === "string" &&
    (typeof obj.description === "undefined" ||
      obj.description === null ||
      typeof obj.description === "string") &&
    (typeof obj.role === "undefined" ||
      obj.role === null ||
      typeof obj.role === "string") &&
    (typeof obj.duration === "undefined" ||
      obj.duration === null ||
      typeof obj.duration === "number") &&
    (typeof obj.unit === "undefined" ||
      obj.unit === null ||
      typeof obj.unit === "string") &&
    (typeof obj.tasks === "undefined" || Array.isArray(obj.tasks))
  );
};

export const copyPasteNodeValidator = (content: any) =>
  isNodeDataApiRequestBody(content);
