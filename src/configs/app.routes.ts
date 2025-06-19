/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root

const usersRoot = 'users';
const authRoot = 'auth';
const bikeRoot = 'bikes';
const bookingRoot = 'bookings';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  user: {
    tag: 'User',
    root: usersRoot,
  },
  auth: {
    tag: 'Auth',
    root: authRoot,
    register: `${authRoot}/register`,
    verify: `${authRoot}/verify`,
    login: `${authRoot}/login`,
    refresh: `${authRoot}/refresh`,
  },

  bike: {
    tag: 'Bike',
    root: bikeRoot,
    activate: `${bikeRoot}/:id/activate`,
    deactivate: `${bikeRoot}/:id/deactivate`,
  },

  booking: {
    tag: 'Booking',
    root: bookingRoot,
  },
};
