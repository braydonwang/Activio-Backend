import axios from "axios";

const API_URL = "/api/exercises/";

const getExercises = async (page) => {
  const { data } = await axios.get(API_URL);

  return data;
};

const exerciseServce = {
  getExercises,
};

export default exerciseServce;