export default abstract class Declaration {
  constructor(protected info) {}

  getInfo() {
    return this.info;
  }

  /*
   * this function must return a string
   * that is valid for a .d.ts file
   */
  abstract toRepresentation(): string;
}
