// class JsonDbService {
//   private _client!: any;
//   private _entity!: any;
//   private _schema!: any;
//   private _repository!: any;

//   public init = async (initParams: {
//     client: any;
//     entity: any;
//     schema: any;
//     repository: any;
//   }): Promise<this> => {
//     const { client, entity, schema, repository } = initParams;
//     this._client = client;
//     this._entity = entity;
//     this._schema = schema;
//     this._repository = repository;
//     await this._client.open(redisUrl);
//     return this;
//   };
// }

// export { JsonDbService };
