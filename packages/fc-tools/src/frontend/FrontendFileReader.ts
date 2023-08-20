export class FrontendFileReader {
  public static async loadFileBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve: Function, _reject: Function) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = async () => {
        resolve(reader.result as any)
      }
    })
  }
}
