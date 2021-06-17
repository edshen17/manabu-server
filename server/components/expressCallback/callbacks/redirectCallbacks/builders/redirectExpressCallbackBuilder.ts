// import { RedirectExpressCallback } from '../redirectExpressCallback';

// class RedirectExpressCallbackBuilder {
//   private readonly _redirectExpressCallbackOptions!: { host: string; endpointPath: string };
//   constructor() {
//     this._redirectExpressCallbackOptions = {
//       host: '',
//       endpointPath: '',
//     };
//   }

//   public host = (host: string) => {
//     this._redirectExpressCallbackOptions.endpointPath = host;
//     return this;
//   };

//   // NOTE: endpointPath string should start with / (eg. /api/users/someUserId)
//   public endpointPath = (endpointPath: string) => {
//     this._redirectExpressCallbackOptions.endpointPath = endpointPath;
//     return this;
//   };
//   public build = () => {
//     const { host, endpointPath } = this._redirectExpressCallbackOptions || {};
//     return new RedirectExpressCallback(`${host}${endpointPath}`);
//   };
// }

// export { RedirectExpressCallbackBuilder };
