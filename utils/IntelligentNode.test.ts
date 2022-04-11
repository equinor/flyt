import { expect } from "@jest/globals";

export const padding = 16;

class IntelligentNode {
  private _id: number;
  private _data: unknown;
  private _width: number;
  private _height: number;

  constructor(
    id: number,
    data: unknown,
    width: number,
    height: number,
    parents?: IntelligentNode[]
  ) {
    this._id = id;
    this._data = data;
    this._width = width;
    this._height = height;
    if (parents) this._parents = parents;
  }

  private _parents: IntelligentNode[];

  get parents() {
    return this._parents;
  }

  set parents(parents: IntelligentNode[]) {
    this._parents = parents;
    if (this._parents.length > 0) {
      const firstParent = this._parents[0];
      const lastParent = this._parents[this._parents.length - 1];
      const x =
        (firstParent.position.x + lastParent.position.x + lastParent._width) /
        2;
      const y = firstParent.position.y;
      this.position = { x, y };
    }
  }

  private _children: IntelligentNode[] = [];

  get children() {
    return this._children;
  }

  private _position: { x: number; y: number } = { x: 0, y: 0 };

  get position() {
    return this._position;
  }

  set position(position: { x: number; y: number }) {
    this._position = position;
  }

  addChild(child: IntelligentNode) {
    if (!this._children) this._children = [];
    if (!this._children.includes(child)) {
      const previousChild = this._children[this._children.length - 1];
      this._children.push(child);

      // Set the child's position
      if (previousChild) {
        // If there is a previous child, set the child's position to the right of the previous child
        child.position = {
          x: previousChild.position.x + previousChild._width + padding,
          y: this.position.y + this._height + padding,
        };
      } else {
        // If there is no previous child, set the child's position straight down from the parent
        child.position = {
          x: this.position.x,
          y: this.position.y + this._height + padding,
        };
      }

      // Update this nodes position
      let x = this.position.x;
      if (this._children.length > 1) {
        const firstChild = this._children[0];
        const lastChild = this._children[this._children.length - 1];
        x = (firstChild.position.x + lastChild.position.x) / 2;
      }
      this.position = {
        x,
        y: this.position.y, // Keep the y position
      };
    }
  }
}

describe("A node that can follow position rules", function () {
  it("should have a position", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    expect(node.position).toEqual({ x: 0, y: 0 });
  });

  it("can add a child", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    const child = new IntelligentNode(2, {}, 100, 100, [node]);
    node.addChild(child);
    expect(node.children).toEqual([child]);
    expect(child.parents).toEqual([node]);
  });

  it("should place the child under itself", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    const child = new IntelligentNode(2, {}, 100, 100, [node]);
    node.addChild(child);
    expect(node.position).toEqual({ x: 0, y: 0 });
    expect(child.position).toEqual({ x: 0, y: 100 + padding });
  });

  it("should update its position after adding two children", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    [
      new IntelligentNode(2, {}, 100, 100, [parent]),
      new IntelligentNode(3, {}, 100, 100, [parent]),
    ].forEach((child) => parent.addChild(child));
    expect(parent.position).toEqual({ x: 58, y: 0 });
    expect(parent.children[0].position).toEqual({ x: 0, y: 116 });
    expect(parent.children[1].position).toEqual({ x: 116, y: 116 });
  });

  it("should update its position after adding three children", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    [
      new IntelligentNode(2, {}, 100, 100, [parent]),
      new IntelligentNode(3, {}, 100, 100, [parent]),
      new IntelligentNode(4, {}, 100, 100, [parent]),
    ].forEach((child) => parent.addChild(child));

    expect(parent.position).toEqual({ x: 116, y: 0 });
  });

  it("should update its position after adding four children", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    [
      new IntelligentNode(2, {}, 100, 100, [parent]),
      new IntelligentNode(3, {}, 100, 100, [parent]),
      new IntelligentNode(4, {}, 100, 100, [parent]),
      new IntelligentNode(5, {}, 100, 100, [parent]),
    ].forEach((child) => parent.addChild(child));
    expect(parent.position).toEqual({ x: 174, y: 0 });
  });

  it("handles grandchildren", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    const child = new IntelligentNode(2, {}, 100, 100, [parent]);
    const grandchild = new IntelligentNode(3, {}, 100, 100, [child]);
    parent.addChild(child);
    child.addChild(grandchild);
    expect(parent.position).toEqual({ x: 0, y: 0 });
    expect(child.position).toEqual({ x: 0, y: 100 + padding });
    expect(grandchild.position).toEqual({ x: 0, y: 200 + padding + padding });
  });

  it("handles a split joining back again", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    const child1 = new IntelligentNode(2, {}, 100, 100, [parent]);
    const child2 = new IntelligentNode(3, {}, 100, 100, [parent]);
    const drain = new IntelligentNode(4, {}, 100, 100, [child1, child2]);

    parent.addChild(child1);
    parent.addChild(child2);
    child1.addChild(drain);
    child2.addChild(drain);

    expect(parent.position).toEqual({ x: 58, y: 0 });
    expect(child1.position).toEqual({ x: 0, y: 116 });
    expect(child2.position).toEqual({ x: 116, y: 116 });
    expect(drain.position).toEqual({ x: 58, y: 232 });
  });
});
