class ExtString {
  /**
   * Converts a string to kebab-case.
   * @param str The input string.
   * @returns The kebab-case version of the input string.
   */
  public static toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // insert - between lowercase/number and uppercase
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // handle ALLCAPS followed by CapitalLower
      .toLowerCase(); // convert to lowercase
  }
}

export default ExtString;
