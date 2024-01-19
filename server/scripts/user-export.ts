require('dotenv').config();

import dayjs from 'dayjs';
import * as xlsx from 'xlsx';
import { makeUserDbService } from '../components/dataAccess/services/user';
import { makeDbConnectionHandler } from '../components/dataAccess/utils/dbConnectionHandler';

const formatDate = (date: Date) => {
  return dayjs(date).format('MM-DD-YYYY');
};

(async () => {
  try {
    const dbConnectionHandler = await makeDbConnectionHandler;
    dbConnectionHandler.connect();

    const userDbService = await makeUserDbService;
    const dbServiceAccessOptions = userDbService.getOverrideDbServiceAccessOptions();
    const users = await userDbService.find({
      searchQuery: {},
      dbServiceAccessOptions,
      paginationOptions: { page: 0, limit: 500, sort: {} },
    });

    const transformedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      createdDate: formatDate(user.createdDate),
      lastOnlineDate: formatDate(user.lastOnlineDate),
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedUsers);
    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
    xlsx.writeFile(workbook, 'users.xlsx');

    console.log('Data exported to users.xlsx');
  } catch (e) {
    console.log(e);
  }
})();
