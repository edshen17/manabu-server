// import { PackageTransactionDoc } from '../../../models/PackageTransaction';
// import { PackageTransactionDbService } from '../../dataAccess/services/packageTransaction/packageTransactionDbService';
// import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
// import { AbstractEntity } from '../abstractions/AbstractEntity';
// import { IEntity } from '../abstractions/IEntity';

// type AppointmentEntityParams = {
//   hostedBy: string;
//   reservedBy: string;
//   packageTransactionId: string;
//   from: Date;
//   to: Date;
// };

// type AppointmentEntityResponse = {
//   hostedBy: string;
//   reservedBy: string;
//   packageTransactionId: string;
//   from: Date;
//   to: Date;
//   isPast: boolean;
//   status: string;
//   cancellationReason?: string;
//   hostedByData: JoinedUserDoc;
//   reservedByData: JoinedUserDoc;
//   packageTransactionData: PackageTransactionDoc;
//   locationData: LocationData;
// };

// type LocationData = {
//   location: string;
//   hostedByMethodId?: string;
//   reservedByMethodId?: string;
//   isOnline: boolean;
// };

// class AppointmentEntity
//   extends AbstractEntity<AppointmentEntityResponse>
//   implements IEntity<AppointmentEntityResponse>
// {
//   private _userDbService!: UserDbService;
//   private _packageTransactionDbService!: PackageTransactionDbService;

//   public build = async (
//     appointmentData: AppointmentEntityParams
//   ): Promise<AppointmentEntityResponse> => {
//     const appointment = this._buildAppointmentEntity(appointmentData);
//     return appointment;
//   };

//   private _buildAppointmentEntity = async (
//     appointmentData: AppointmentEntityParams
//   ): Promise<AppointmentEntityResponse> => {
//     const { hostedBy, reservedBy, packageTransactionId, from, to } = appointmentData;

//     return Object.freeze({
//       hostedBy,
//       reservedBy,
//       packageTransactionId,
//       from,
//       to,
//       isPast: false,
//       status: 'pending',
//       hostedByData: (await this.getDbDataById(this._userDbService, hostedBy)) || {},
//       reservedByData: (await this.getDbDataById(this._userDbService, reservedBy)) || {},
//       packageTransactionData:
//         (await this.getDbDataById(this._packageTransactionDbService, packageTransactionId)) || {},
//       locationData: {
//         location: 't',
//         isOnline: true,
//       },
//     });
//   };

//   public init = async (props: {
//     makeUserDbService: Promise<UserDbService>;
//     makePackageTransactionDbService: Promise<PackageTransactionDbService>;
//   }): Promise<this> => {
//     const { makeUserDbService, makePackageTransactionDbService } = props;
//     this._userDbService = await makeUserDbService;
//     this._packageTransactionDbService = await makePackageTransactionDbService;
//     return this;
//   };
// }

// export { AppointmentEntity };
