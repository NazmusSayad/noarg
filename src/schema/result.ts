export class ResultOk {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public value: any) {}
}

export class ResultErr {
  constructor(public message: string) {}
}
