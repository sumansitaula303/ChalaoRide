// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface UserData {
//   user:{full_name: string;
//     profile_picture: string;
//     phonenumber: string;
//     address: string;
//     dateofbirth: string;
//     gender: string;
//     occupation: string;
//     citizenship_number: string;
//     nid_number: string;
//     issued_district: string;
//     issued_date: string;
//     citizenship_front: string;
//     citizenship_back: string;}
  
//   license_number: string;
//   expiry_date: string;
//   issued_districtLicense: string;
//   driving_license_front: string | null;
//   user_image_top: string | null;
//   user_image_left: string | null;
//   user_image_right: string | null;
// }

// interface UserContextType {
//   userData: UserData;
//   setUserData: (data: Partial<UserData>) => void;  // Allow partial updates
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [userData, setUserDataState] = useState<UserData>({
//     user:{full_name: '',
//       profile_picture: '',
//     phonenumber: '',
//     address: '',
//     dateofbirth: '',
//     gender: '',
//     occupation: '',
//     citizenship_number: '',
//     nid_number: '',
//     issued_district: '',
//     issued_date: '',
//     citizenship_front: '',
//     citizenship_back: '',},
//     license_number: '',
//     expiry_date: '',
//     issued_districtLicense: '',
//     driving_license_front: null,
//     user_image_top: null,
//     user_image_left: null,
//     user_image_right: null,
//   });

//   // Modify setUserData to allow partial updates
//   const setUserData = (data: Partial<UserData>) => {
//     setUserDataState(prevData => ({
//       ...prevData,
//       ...data,
//     }));
//   };

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
