/**
 * Utility class for common methods
 */
export abstract class Utils {
  public static isBlank(obj: any): boolean {
    if (obj === null || obj === undefined) {
      return true;
    }

    return false;
  }

  public static isNotBlank(obj: any): boolean {
    return !this.isBlank(obj);
  }
}
