export const mock = {
  auth: {
    // eslint-disable-next-line
    createUserWithEmailAndPassword: (email: string, password: string) => {
      return new Promise((resolve, reject) => {
        if (email === "generate@error.pl") {
          reject(new Error("Auth error occured"));
        } else {
          resolve({ user: { uid: "testuid" } });
        }
      });
    },
  },
  fireBaseDatabase: {
    // eslint-disable-next-line
    ref: (refAddress: string) => {
      return {
        set: (value: any, callback?: (e?: any) => void) => {
          return new Promise((resolve, reject) => {
            if (value.email === "generateRole@error.pl") {
              if (callback) {
                callback("Error");
              }
              reject(new Error("Role error occured"));
            } else {
              if (callback) {
                callback();
              }
              resolve(null);
            }
          });
        },
      };
    },
  },
};
