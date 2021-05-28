export interface IUsecase {
  build: (arg: any) => Promise<{} | undefined>;
}
