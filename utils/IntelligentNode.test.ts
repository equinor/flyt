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
    parents?: IntelligentNode[],
    children?: IntelligentNode[]
  ) {
    this._id = id;
    this._data = data;
    this._width = width;
    this._height = height;
    if (parents) {
      this._parents = parents;
      parents.forEach((parent) => {
        parent.addChild(this);
      });
    }
    if (children) {
      this._children = children;
      children.forEach((child) => {
        child.addParent(this);
      });
    }

    this._position = {
      x: 0,
      y: 0,
    };
  }

  private _parents: IntelligentNode[];

  get parents() {
    return this._parents;
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

  addParent(parent: IntelligentNode) {
    if (!this._parents) {
      this._parents = [parent];
      parent.addChild(this);
    }
    if (!this._parents.includes(parent)) {
      this._parents.push(parent);
      parent.addChild(this);
    }
    // position this node
    const firstParent = this._parents[0];
    let x = firstParent.position.x;
    let y = firstParent.position.y + firstParent._height + padding;
    if (this._parents.length > 1) {
      // If there are multiple parents, position this node at the middle of the parents
      // Also, Make sure we position the node below any of the parents
      const lastParent = this._parents[this._parents.length - 1];
      if (lastParent) {
        x =
          (firstParent.position.x + lastParent.position.x + lastParent._width) /
          2;
        const maxY = Math.max(
          ...this._parents.map((parent) => parent.position.y)
        );
        const furthestDownParent = this._parents.find(
          (p) => p.position.y === maxY
        );
        y = maxY + furthestDownParent._height + padding;
      }
    }
    this.position = { x, y };
  }

  getSiblings() {
    let myIndex;
    const siblings: IntelligentNode[] = []; // Siblings of this node
    const allSiblings: IntelligentNode[] = []; // All siblings, including this node

    if (this.parents) {
      this.parents.forEach((parent, parentIndex, parentArray) => {
        parent.children.forEach((child, index) => {
          if (child === this) {
            myIndex = index;
          } else {
            siblings.push(child);
          }
          allSiblings.push(child);
        });
      });
    }
    return { siblings, myIndex, allSiblings };
  }

  addChild(child: IntelligentNode) {
    if (!this._children) this._children = [];
    if (this._children.includes(child)) return; // already added, do not add again
    this._children.push(child);
    child.addParent(this);

    let x = this.position.x;
    if (this._children.length > 1) {
      const firstChild = this._children[0];
      const lastChild = this._children[this._children.length - 1];
      x = (firstChild.position.x + lastChild.position.x + lastChild._width) / 2;
    }
    this.position = {
      x,
      y: this.position.y, // Keep the y position
    };
  }
}

describe("A intelligent node", function () {
  it("should have a position", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    expect(node.position).toEqual({ x: 0, y: 0 });
  });

  it("can add a child", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    const child = new IntelligentNode(2, {}, 100, 100, [node]);
    expect(node.children).toEqual([child]);
    expect(child.parents).toEqual([node]);
  });

  it("should place the child under itself", function () {
    const node = new IntelligentNode(1, {}, 100, 100);
    const child = new IntelligentNode(2, {}, 100, 100);
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

    expect(parent.children[0].position).toEqual({ x: 0, y: 100 + padding });
    expect(parent.children[1].position).toEqual({
      x: 100 + padding,
      y: 100 + padding,
    });
    expect(parent.position).toEqual({ x: 58, y: 0 });
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

    expect(parent.position).toEqual({ x: 0, y: 0 });
    expect(child.position).toEqual({ x: 0, y: 100 + padding });
    expect(grandchild.position).toEqual({ x: 0, y: 200 + padding + padding });
  });

  it("can name its siblings", () => {
    const parent = new IntelligentNode(1, {}, 100, 100);
    const child1 = new IntelligentNode(2, {}, 100, 100);
    const child2 = new IntelligentNode(3, {}, 100, 100);

    parent.addChild(child1);
    parent.addChild(child2);

    // expect child1 to be sibling to child2, and vice versa
    expect(child1.getSiblings().siblings).toEqual([child2]);
    expect(child2.getSiblings().siblings).toEqual([child1]);

    //all siblings
    expect(child1.getSiblings().allSiblings).toEqual([child1, child2]);
    expect(child2.getSiblings().allSiblings).toEqual([child1, child2]);

    // check index
    expect(child1.getSiblings().myIndex).toEqual(0);
    expect(child2.getSiblings().myIndex).toEqual(1);
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
