export class CommonFuncs {
  public static wrapColumn(column: string) {
    return /[ `]/.test(column) ? column : `\`${column}\``
  }
}
