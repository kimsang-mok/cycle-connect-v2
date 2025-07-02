/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root

const usersRoot = 'users';
const authRoot = 'auth';
const bikeRoot = 'bikes';
const bookingRoot = 'bookings';
const paymentRoot = 'payments';
const uploadRoot = 'uploads';
const locationRoot = 'locations';

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
    me: `${authRoot}/me`,
    refresh: `${authRoot}/refresh`,
    resendVerification: `${authRoot}/resend-verification`,
  },

  bike: {
    tag: 'Bike',
    root: bikeRoot,
    get: `${bikeRoot}/:id`,
    activate: `${bikeRoot}/:id/activate`,
    deactivate: `${bikeRoot}/:id/deactivate`,
    myBikes: `${bikeRoot}/me`,
  },

  booking: {
    tag: 'Booking',
    root: bookingRoot,
    myBooking: `${bookingRoot}/me`,
    renterBookings: `${bookingRoot}/renter`,
    byBike: `${bookingRoot}/bike/:bikeId`,
  },

  payment: {
    tag: 'Payment',
    root: paymentRoot,
    createOrder: `${paymentRoot}/create-order`,
    authorize: `${paymentRoot}/authorize`,
    capture: `${paymentRoot}/capture`,
  },

  upload: {
    tag: 'Upload',
    presign: `${uploadRoot}/presign`,
  },

  location: {
    tag: 'Location',
    root: locationRoot,
    provinces: `${locationRoot}/provinces`,
    districts: `${locationRoot}/districts`,
  },
};
