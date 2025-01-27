import axiosInstance from '@/services/axiosInstance';
import axios from 'axios';
import { Alert } from 'react-native';
import { api_url } from '@/context/AuthContext';



const getNewAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${api_url}/api/auth/refresh-token`, { refreshToken });
    return response.data.accessToken; // Assuming it returns the new access token
  } catch (error) {
    console.error("Error refreshing token", error);
    throw new Error("Unable to refresh token");
  }
};


export const submitUserProfile = async (
  userProfile: any,
  token: string,
  refreshToken: string
): Promise<any> => {
  try {
    // Add token to the header for this request
    const response = await axiosInstance.patch(`${api_url}/api/auth/user-profile/`, userProfile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response:", response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to submit user profile");
    }
  } catch (error: any) {
    if (error.response?.status === 401 && error.response?.data?.detail === "Token is invalid or expired") {
      // Refresh token and retry
      try {
        const newAccessToken = await getNewAccessToken(refreshToken);  // Ensure getNewAccessToken returns the new access token

        // Retry the request with the new token
        const retryResponse = await axiosInstance.patch(`${api_url}/api/auth/user-profile/`, userProfile, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Alert.alert("Error", "Session expired. Please log in again.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      Alert.alert("Error", "No response from server.");
    } else {
      console.error("Error setting up request:", error.message);
      Alert.alert("Error", "Error occurred while setting up the request.");
    }
  }
};


export const getUserProfile = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`${api_url}/api/auth/user-profile/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
        return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};



export const updateUserProfileImage = async (token: string, imageUri: string,) => {
  try {
    const formData = new FormData();
    
    // Adjusting formData to send the image under `user[profile_picture]`
    const imageBlob = {
      uri: imageUri,
      name: "profile.jpg", // You can name it as needed
      type: "image/jpeg", // MIME type of the image
    };

    formData.append("user[profile_picture]", imageBlob as any);

    const response = await axios.patch(
      `${api_url}/api/auth/user-profile/`, // Ensure this matches your actual API endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update profile picture.");
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};





export const updateUserProfile = async (
  token: string,
  refreshToken: string,
  userDetails: {
    fullName: string;
    phoneNumber: string;
    address: string;
    dob: string;
    gender: string;
    occupation: string;
  }
) => {
  const sendRequest = async (accessToken: string) => {
    try {
      const formData = new FormData();

      // Append user details to FormData
      formData.append('user[full_name]', userDetails.fullName);
      formData.append('user[phonenumber]', userDetails.phoneNumber);
      formData.append('user[address]', userDetails.address);
      formData.append('user[dateofbirth]', userDetails.dob);
      formData.append('user[gender]', userDetails.gender);
      formData.append('user[occupation]', userDetails.occupation);

      // Send the request
      const response = await axios.patch(
        `${api_url}/api/auth/user-profile/`, // Ensure this matches your actual API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update user profile.');
      }
    } catch (error: any) {
      // Check for 401 status and attempt token refresh
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting to refresh token...');
        try {
          const newAccessToken = await getNewAccessToken(refreshToken);

          // Retry the request with the new token
          return await sendRequest(newAccessToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          Alert.alert('Error', 'Session expired. Please log in again.');
          throw refreshError;
        }
      } else {
        console.error('Error updating user profile:', error);
        Alert.alert('Error', 'Failed to update user profile. Please try again later.');
        throw error;
      }
    }
  };

  return await sendRequest(token);
};

export const updateCitizenshipData = async (
  token: string,
  refreshToken: string,
  citizenshipDetails: {
    citizenshipNumber: number,
    nidNumber: number;
    issuedDate: string;
    issuedDistrict: string;
    citizenshipFront: string;  // Assuming base64 or image URI
    citizenshipBack: string;   // Assuming base64 or image URI
  }
) => {
  const sendRequest = async (accessToken: string) => {
    try {
      const formData = new FormData();

      // Append citizenship details to FormData
      formData.append('user[citizenship_number]', citizenshipDetails.citizenshipNumber.toString());
      formData.append('user[nid_number]', citizenshipDetails.nidNumber.toString());
      formData.append('user[issued_date]', citizenshipDetails.issuedDate);
      formData.append('user[issued_district]', citizenshipDetails.issuedDistrict);

      // If you're uploading images (citizenship front and back)
      const citizenshipFrontBlob = {
        uri: citizenshipDetails.citizenshipFront,
        name: 'citizenship_front.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };

      const citizenshipBackBlob = {
        uri: citizenshipDetails.citizenshipBack,
        name: 'citizenship_back.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };

      formData.append('user[citizenship_front]', citizenshipFrontBlob as any);
      formData.append('user[citizenship_back]', citizenshipBackBlob as any);

      // Send the request
      const response = await axios.patch(
        `${api_url}/api/auth/user-profile/`, // Ensure this matches your actual API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update citizenship profile.');
      }
    } catch (error: any) {
      // Check for 401 status and attempt token refresh
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting to refresh token...');
        try {
          const newAccessToken = await getNewAccessToken(refreshToken);

          // Retry the request with the new token
          return await sendRequest(newAccessToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          Alert.alert('Error', 'Session expired. Please log in again.');
          throw refreshError;
        }
      } else {
        console.error('Error updating citizenship profile:', error);
        Alert.alert('Error', 'Failed to update citizenship profile. Please try again later.');
        throw error;
      }
    }
  };

  return await sendRequest(token);
};

export const userImage = async (
  token: string,
  refreshToken: string,
  userImage: {
    user_image_top: string;
    user_image_left: string;
    user_image_right: string;
  }
) => {
  const sendRequest = async (accessToken: string) => {
    try {
      const formData = new FormData();

      
      // If you're uploading images (citizenship front and back)
      const userImageTopBlob = {
        uri: userImage.user_image_top,
        name: 'user_image_top.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };

      const userImageLeftBlob = {
        uri: userImage.user_image_left,
        name: 'user_image_left.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };
      const userImageRightBlob = {
        uri: userImage.user_image_right,
        name: 'user_image_right.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };

      formData.append('user_image_top', userImageTopBlob as any);
      formData.append('user_image_left', userImageLeftBlob as any);
      formData.append('user_image_right', userImageRightBlob as any);

      // Send the request
      const response = await axios.patch(
        `${api_url}/api/auth/user-profile/`, // Ensure this matches your actual API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update citizenship profile.');
      }
    } catch (error: any) {
      // Check for 401 status and attempt token refresh
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting to refresh token...');
        try {
          const newAccessToken = await getNewAccessToken(refreshToken);

          // Retry the request with the new token
          return await sendRequest(newAccessToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          Alert.alert('Error', 'Session expired. Please log in again.');
          throw refreshError;
        }
      } else {
        console.error('Error updating citizenship profile:', error);
        Alert.alert('Error', 'Failed to update citizenship profile. Please try again later.');
        throw error;
      }
    }
  };

  return await sendRequest(token);
};

export const updateLicenseData = async (
  token: string,
  refreshToken: string,
  LicenseDetails: {
    license_number: number,  
    expiry_date: string;
    issuedDistrict: string;
    licenseFront: string;  // Assuming base64 or image URI
 
  }
) => {
  const sendRequest = async (accessToken: string) => {
    try {
      const formData = new FormData();

      // Append citizenship details to FormData
      formData.append('license_number', LicenseDetails.license_number.toString());
    
      formData.append('expiry_date', LicenseDetails.expiry_date);
      formData.append('issued_district', LicenseDetails.issuedDistrict);

      // If you're uploading images (citizenship front and back)
      const LicenseFrontBlob = {
        uri: LicenseDetails.licenseFront,
        name: 'license_front.jpg', // Adjust the name if necessary
        type: 'image/jpeg', // Or adjust according to the image type
      };

      

      formData.append('driving_license_front', LicenseFrontBlob as any);

      // Send the request
      const response = await axios.patch(
        `${api_url}/api/auth/user-profile/`, // Ensure this matches your actual API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to upload license  profile.');
      }
    } catch (error: any) {
      // Check for 401 status and attempt token refresh
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting to refresh token...');
        try {
          const newAccessToken = await getNewAccessToken(refreshToken);

          // Retry the request with the new token
          return await sendRequest(newAccessToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          Alert.alert('Error', 'Session expired. Please log in again.');
          throw refreshError;
        }
      } else {
        console.error('Error updating citizenship profile:', error);
        Alert.alert('Error', 'Failed to update citizenship profile. Please try again later.');
        throw error;
      }
    }
  };

  return await sendRequest(token);
};