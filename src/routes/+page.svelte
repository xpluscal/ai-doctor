<script>
import {enhance} from '$app/forms';
import Stepper from './Stepper.svelte';

  let step = 0;
  let chiefComplaint;
  let name;
  let age;
  let sex;
  let weight;
  let height;
  let occupation;
  let lifestyle;
  let medicalHistory;
  let loading = false;
  let diagnoses = [];

  let state = 1;

  function nextStep() {
    step += 1;
  }

  function previousStep() {
    step -= 1;
  }
</script>

<style>
  .form-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
    margin-top: 2rem;
  }

  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .step {
    display: none;
  }

  .step.active {
    display: block;
  }

  .logo{
    height: 56px;
  }
</style>

<div class="form-container">
    <div class="header">
        <a href="/"><img src="/logo.svg" alt="AI Doctor" class="logo"></a>
        <span>Self Assessment</span>
    </div>

    <Stepper current={step}/>
  {#if state === 1}
  <form method="POST" action="?/submit" use:enhance={({ form, data, cancel }) => {
        loading = true;
        state = 2;
        return async ({ result }) => {
            console.log("diagnoses: ",result);
            if(result.status === 200) {
                diagnoses = result.data.result;
                console.log("diagnoses: ",diagnoses);
                state = 4;
            } else {
                state = 3;
            }
        };
    }}>
    <div class="step {step === 0 ? 'active' : ''}">
      <!-- <label for="chiefComplaint">Chief Complaint</label> -->
      <p>
        Please enter your primary health concern or symptom that you're currently experiencing. This will help us better understand the reason for your visit and guide our AI Doctor to provide a preliminary evaluation based on your input.
      </p>
      <textarea rows="5" id="chiefComplaint" name="chiefComplaint" bind:value="{chiefComplaint}" placeholder="e.g., Persistent headache, shortness of breath, chest pain..." />
      <button type="button" on:click="{nextStep}" class="btn-primary">Next</button>
    </div>

    <div class="step {step === 1 ? 'active' : ''}">

        <p>Please provide some additional information about you so we can tailor your request.</p>
      <!-- <label for="name">Name <span class="text-red">*</span></label>
      <input id="name" bind:value="{name}" required /> -->

      <label for="age">Age <span class="text-red">*</span></label>
      <input id="age" type="number" bind:value="{age}" required />

      <label for="sex">Sex</label>
      <select id="sex" name="sex" bind:value="{sex}">
        <option value="">Select Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label for="weight">Weight (kg)</label>
      <input id="weight" name="weight" type="number" bind:value="{weight}" />

      <label for="height">Height (cm)</label>
      <input id="height" name="height" type="number" bind:value="{height}" />

      <label for="occupation">Occupation</label>
      <input id="occupation" name="occupation" bind:value="{occupation}" />

        <button type="button" on:click="{previousStep}" class="secondary">Previous</button>

        <button type="button" on:click="{nextStep}" class="btn-primary">Next</button>

    </div>

    <div class="step {step === 2 ? 'active' : ''}">

        <label for="lifestyle">Lifestyle</label>
        <p>Please provide a brief description of your daily habits, including diet, exercise, sleep, and any other relevant aspects of your lifestyle. This information will help the AI Doctor take into account potential contributing factors to your health concerns.</p>
        <textarea id="lifestyle" name="lifestyle" placeholder="e.g., Mostly sedentary job, vegetarian diet, moderate exercise 3 times a week, 7 hours of sleep per night..." bind:value="{lifestyle}" />

        <label for="medicalHistory">Medical History</label>
        <p>Please list any known medical conditions, past surgeries, or significant health events you have experienced, as well as any medications you are currently taking. This information will assist the AI Doctor in understanding your overall health background and considering any potential interactions or complications.</p>
        <textarea id="medicalHistory" name="medicalHistory" placeholder="e.g., Hypertension, appendectomy in 2015, currently taking lisinopril 10mg daily..." bind:value="{medicalHistory}"></textarea>
        <button type="button" on:click="{previousStep}" class="secondary">Previous</button>
        <button type="submit" class="btn-primary">Submit</button>
    </div>

    </form>
  {:else if state === 2}
    <article aria-busy="true">Generating Diagnosis...</article>
  {:else if state === 3}
    <p>Something went wrong.</p>
  {:else}
    <article><small><b>Disclaimer:</b> The information provided on this website, including any diagnosis, potential treatments, and next steps, is intended for informational and educational purposes only and should not be considered professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional before making any decisions regarding your health or medical conditions. Never disregard, avoid, or delay seeking professional medical advice because of something you have read on this website. If you believe you are experiencing a medical emergency, call your local emergency number or seek immediate medical attention.</small></article>

    {#each diagnoses as diagnosis}
        <article>
            <h2>
                {diagnosis.diagnosis.title}
            </h2>
            <span>Likelihood: {diagnosis.diagnosis.likelihood_score}</span>
            <p>
                {diagnosis.diagnosis.description}
            </p>

            <h3>
                Possible Treatments
            </h3>

            <ul>
                {#each diagnosis.treatments as treatment}
                    <li>
                        {treatment}
                    </li>
                {/each}
            </ul>

            <h3>
                Next Steps
            </h3>

            <ul>
                {#each diagnosis.nextSteps as nextStep}
                    <li>
                        {nextStep}
                    </li>
                {/each}
            </ul>
        </article>
    {:else}
         <!-- empty list -->
    {/each}
  {/if}
</div>