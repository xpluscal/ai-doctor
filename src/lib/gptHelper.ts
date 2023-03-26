interface UserData {
  chiefComplaint: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  occupation: string;
  lifestyle: string;
  medicalHistory: string;
}

export function createGPTPrompt(userData: UserData): string {
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

  let prompt = `Please provide a diagnosis, potential treatments, and next steps for me:\n\n` +
    `Chief Complaint: ${chiefComplaint}\n` +
    `Age: ${age}\n` +
    `Sex: ${sex}\n` +
    `Weight: ${weight} kg\n` +
    `Height: ${height} cm\n` +
    `Occupation: ${occupation}\n` +
    `Lifestyle: ${lifestyle}\n` +
    `Medical History: ${medicalHistory}.\n\n` + 
    `Please provide your response as structured json where each potential diagnosis is its own object and contains a likelihood score as well as the information requested above and an array of potential way to treat it and an array of potential next steps. Please include as many potential diagnoses as necessary, up to a maximum of 3.`;

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

  let prompt = `Please provide up to 4 potential diagnoses for the following information along with a likelihood score based on the information given as percentage value for each diagnosis, order by likelihood descrending:\n\n` +
    `Chief Complaint: ${chiefComplaint}\n` +
    `Age: ${age}\n` +
    `Sex: ${sex}\n` +
    `Weight: ${weight} kg\n` +
    `Height: ${height} cm\n` +
    `Occupation: ${occupation}\n` +
    `Lifestyle: ${lifestyle}\n` +
    `Medical History: ${medicalHistory}.\n\n` +
    `Please provide responses as structured json that is 1. an array called "diagnoses" where each entry represents a diagnosis with a title, description and a likelihood_score and 2. "comment": a comment that represents a critical reflection of your confidence in the overall results. Please make your response fit the maximum characters allowed and do not include spaces, line breaks or any other non-allowed symbols in json and ensure it's valid json.`;

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