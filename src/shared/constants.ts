// Strings
export const paramMissingError = 'One or more of the required parameters was missing.';
export const loginFailedErr = 'Login failed';
export const loginSuccess = 'Login Success';
export const mailSenderError = 'Failed to send mail';
export const userCollection = 'users';
export const droneRoutesCollection = 'drone_routes';
export const droneCollection = 'drones';
export const getFailed = 'Cannot get data from DB';
export const updateSuccessfull = 'Update successful';
export const updateFailed = 'Update failed';
export const deleteSuccess = 'Delete successful';
export const deleteFailed = 'Delete failed';
export const logoutMessage = 'User logged out';
export const dataNotFound = 'Data does not exist';
export const hashError = 'Error occured during hasing';
// Numbers
export const pwdSaltRounds = 10;

// Cookie Properties
export const cookieProps = Object.freeze({
    key: 'drone-backend',
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: true,
        path: (process.env.COOKIE_PATH),
        maxAge: Number(process.env.COOKIE_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});


// Response messages

// Users
export const noUsers = 'No Users Found';
export const addUserSuccess = 'User added successfully';
export const addUserFail = 'User failed to add';
export const userNotFound = 'User not found';

// Drone Routes
export const noRoutesAvailable = 'No Routes Present';
export const droneRouteAddSuccess = 'Drone Route added successfully';


// Drones
export const noDronesAvailable = 'No Drones Present';
export const droneAddSuccess = 'Drone added successfully';