import axios from "axios";
import { windowState } from "../windowState.js";

const validTypes = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

export const getNumbers = async (req, res) => {
  const { type } = req.params;

  if (!validTypes[type]) {
    return res.status(400).json({ error: "Invalid type. Use p, f, e, or r." });
  }

  const apiUrl = `http://20.244.56.144/evaluation-service/${validTypes[type]}`;

  let response;
  const windowPrevState = [...windowState];
  const yourAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDU5MjA3LCJpYXQiOjE3NDcwNTg5MDcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImUyNTMxZjNmLTZhYzctNGFkZi1iM2I4LWM3NDcyODIxYjI1NSIsInN1YiI6ImNiLmVuLnU0Y3NlMjI1MTNAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSJ9LCJlbWFpbCI6ImNiLmVuLnU0Y3NlMjI1MTNAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJndXJ1c2FyYW4gYSBiIiwicm9sbE5vIjoiY2IuZW4udTRjc2UyMjUxMyIsImFjY2Vzc0NvZGUiOiJTd3V1S0UiLCJjbGllbnRJRCI6ImUyNTMxZjNmLTZhYzctNGFkZi1iM2I4LWM3NDcyODIxYjI1NSIsImNsaWVudFNlY3JldCI6IllDcFpTU05YUllRSktVdVAifQ.b4CYnaxrH3DqA-_eu_3zgb0VTgBAQ_GzoGgUWNsiQ-0"; // Replace with actual token

  try {
    // Set timeout for 500ms
    console.log("Fetching data from API...");
    response = await axios.get(apiUrl, {
      timeout: 500,
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
      },
    });
    console.log("API Response:", response.data);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(200).json({
      windowPrevState,
      windowCurrState: windowState,
      numbers: [],
      avg: average(windowState),
    });
  }

  const newNumbers = response.data.numbers || [];
  console.log("New Numbers:", newNumbers);

  // Process and add numbers to the windowState
  const numbersAdded = [];
  for (let num of newNumbers) {
    if (!windowState.includes(num)) {
      windowState.push(num);
      numbersAdded.push(num);
      if (windowState.length > 10) {
        windowState.shift(); // remove the oldest number
      }
    }
  }

  console.log("Updated windowState:", windowState);

  const windowCurrState = [...windowState];

  res.status(200).json({
    windowPrevState,
    windowCurrState,
    numbers: newNumbers,
    avg: average(windowState),
  });
};

const average = (arr) => {
  if (!arr.length) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / arr.length).toFixed(2));
};
