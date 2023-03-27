interface UserData {
  chiefComplaint: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  occupation: string;
  country: string;
  lifestyle: string;
  medicalHistory: string;
}

export function createPrompt(userData: UserData): string {
  const { chiefComplaint, age, sex, weight, height, occupation, country, lifestyle, medicalHistory } = userData;
  const prompt = `Diagnose and suggest treatments/next steps for:\n\nChief Complaint: ${chiefComplaint}\nAge: ${age}\nSex: ${sex}\nWeight: ${weight} kg\nHeight: ${height} cm\nOccupation: ${occupation}\nCountry of residence: ${country}\nLifestyle: ${lifestyle}\nMedical History: ${medicalHistory}.\n\nProvide 1-4 potential diagnoses in JSON format as array field "diagnoses", ordered by likelihood descending, each with title, description, likelihood score (in %, determined by information provided as well as global statistics), up to 4-6 "treatments" (Include medications as well as lifestyle and self-care recommendations), and up to 4-6 "next_steps" (order by certainty and urgency of the next step with the most important and urgent being first) arrays of strings with sufficient detail. Also add a string "comment" that represents your overall confidence in the results given the amount of data provided. Ensure VALID JSON and minimize characters used. Incorrect JSON will not be accepted. No trailing commas in JSON arrays. Talk directly to user and do not refer as patient. The response can not be longer than 1023 tokens.`;
  return prompt;
}

export function createDiagnosisPrompt(userData: UserData): string {
  const {
    chiefComplaint,
    age,
    sex,
    weight,
    height,
    occupation,
    lifestyle,
    medicalHistory,
  } = userData;

  let prompt = `Given:\n` +
    `CC: ${chiefComplaint}, Age: ${age}, Sex: ${sex}, W: ${weight} kg, H: ${height} cm, Occ: ${occupation}, LS: ${lifestyle}, MH: ${medicalHistory}.\n\n` +
    `Provide up to 4 potential diagnoses with likelihood scores (in %), ordered by likelihood. Format as JSON with diagnoses array with title, description and score attributes and a comment on confidence.`;

  return prompt;
}

export function createTreatmentsPrompt(diagnosis: string): string {
  let prompt = `Please provide an array of potential treatments for the diagnosis '${diagnosis}'. Include medications as well as lifestyle and self-care recommendations. `+
  `Please provide responses as json string array where each entry is a human readable string of the suggested treatment. Include spaces. Please make your response fit the maximum characters allowed in a response and do not include spaces, line breaks, escape symbols or any other non-allowed symbols in json and ensure it's valid json.`;

  return prompt;
}

export function createNextStepsPrompt(diagnosis: string): string {
  let prompt = `Please provide an array of potential next steps for my diagnosis '${diagnosis}'. Please order by certainty and urgency of the next step with the most important and urgent being first.`+
   `Please provide responses as json string array where each entry is a human readable string of the suggested next step. Include spaces. Please make your response fit the maximum characters allowed in a response and do not include spaces, line breaks, escape symbols or any other non-allowed symbols in json and ensure it's valid json.`;
  return prompt;
}