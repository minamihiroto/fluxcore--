import axios from 'axios';

export const createDirectory = async (directoryName: string, userId: number, boxId: number) => {
  try {
    const token = localStorage.getItem("access");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post('/directory/create/', { name: directoryName, user_id: userId, box_id: boxId }, config);
    return response.data;
  } catch (error) {
    console.error("Error creating directory:", error);
    return null;
  }
};

export const getDirectories = async (boxId: number) => {
  try {
    const response = await axios.get(`/directory/list/${boxId}`);
    return response.data.directories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getDirectoryDetail = async (directoryId: number) => {
  try {
    const response = await axios.get(`/directory/${directoryId}`);
    return response.data.directory;
  } catch (error) {
    console.error(`Error fetching directory details: ${error}`);
    throw error;
  }
};