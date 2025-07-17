/**
 * ### RootItemStack
 *
 * A stack data structure that requires a root
 * element, and will always maintain that root element.
 */
export class RootItemStack<Item> {
  private stack: Array<Item>;
  private root: Item;

  constructor(root: Item) {
    this.stack = [root];
    this.root = root;
  }

  public push(item: Item): void {
    this.stack.push(item);
  }

  public pop(): void {
    if (this.stack.length === 1) {
      return;
    }
    this.stack.pop();
  }

  public peek(): Item {
    return this.stack.at(-1) ?? this.root;
  }

  public reset(): void {
    this.stack = [this.root];
  }
}
