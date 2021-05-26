declare module 'mongoose' {
  interface Query {
    cache: (options: Record<string, unknown>) => Query;
    useCache: boolean;
    time: number;
    hashKey: string;
    queryKey: unknown;
    mongooseCollection: {
      name: string;
    };
    model: { new (d: any): any };
  }
}
