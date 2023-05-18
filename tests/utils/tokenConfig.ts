export class TokenConfig {
  constructor(
    public readonly address: string,
    public readonly symbol: string,
    // @ts-ignore
    public readonly decimals: i32
  ) {}
}
