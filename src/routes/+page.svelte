<script>
import {enhance} from '$app/forms';
import Stepper from './Stepper.svelte';
import SvelteSeo from "svelte-seo";
import { page } from '$app/stores';

  let step = 0;
  let chiefComplaint = "";
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
  let comment = "";
  let modalOpen = true;

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

  .scroll-modal{
    height: 340px;
    max-height: 80vh;
    overflow-y: scroll;
  }

  footer{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  footer small{
    font-size: 0.8rem;
    max-width: 400px;
    margin-right: 1rem;
  }

  .bottom-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    width: 100%;
  }

  .error{
    background-color: #EA564A;
    color: #fff;
  }

  .warning{
    background-color: #F7B500;
    color: #fff;
    padding: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .actions{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  label{
    font-weight: 600;
  }

</style>

<svelte:head>
  <title>AI Doctor | Self Assessment</title>
</svelte:head>

<SvelteSeo
  title="AI Doctor | Self Assessment"
  description="Get a preliminary evaluation of your health concerns using AI-powered medical assessment."
  canonical="https://www.ai-doctor.com/"
  keywords="AI doctor, artificial intelligence, medical assessment, health evaluation, self-assessment"
  openGraph={{
    title: 'AI Doctor | AI-Powered Medical Assessment',
    description: 'Get a preliminary evaluation of your health concerns using AI-powered medical assessment.',
    images: [
      {
        url: $page.url.origin + '/seo-image.png',
        width: 1200,
        height: 630
      },
    ],
    url: 'https://www.ai-doctor.com/',
    type: 'website'
  }}
/>
<div class="form-container">
    <div class="header">
        <a href="/"><img src="/logo.svg" alt="AI Doctor" class="logo"></a>
        <span>Self Assessment</span>
    </div>

    {#if state !== 4 && state !== 2}
    <Stepper current={step}/>
    {/if}
  {#if state === 1}
  <form method="POST" action="?/submit" use:enhance={({ form, data, cancel }) => {
        loading = true;
        state = 2;
        return async ({ result }) => {
            if(result.status === 200) {
                diagnoses = result.data.result;
                comment = result.data.comment;
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
      <button disabled={chiefComplaint.length <= 0} type="button" on:click="{nextStep}" class="btn-primary">Next</button>
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

      <div class="actions">
        <button type="button" on:click="{previousStep}" class="secondary">Previous</button>

        <button type="button" on:click="{nextStep}" class="btn-primary">Next</button>
      </div>

    </div>

    <div class="step {step === 2 ? 'active' : ''}">

        <label for="lifestyle">Lifestyle (Optional)</label>
        <p><small>Please provide a brief description of your daily habits, including diet, exercise, sleep, and any other relevant aspects of your lifestyle. This information will help the AI Doctor take into account potential contributing factors to your health concerns.</small></p>
        <textarea rows={5} id="lifestyle" name="lifestyle" placeholder="e.g., Mostly sedentary job, vegetarian diet, moderate exercise 3 times a week, 7 hours of sleep per night..." bind:value="{lifestyle}" />

        <!-- <label for="medicalHistory">Medical History</label>
        <p>Please list any known medical conditions, past surgeries, or significant health events you have experienced, as well as any medications you are currently taking. This information will assist the AI Doctor in understanding your overall health background and considering any potential interactions or complications.</p>
        <textarea id="medicalHistory" name="medicalHistory" placeholder="e.g., Hypertension, appendectomy in 2015, currently taking lisinopril 10mg daily..." bind:value="{medicalHistory}"></textarea> -->

        <div class="actions">
          <button type="button" on:click="{previousStep}" class="secondary">Previous</button>
          <button type="submit" class="btn-primary">Submit</button>
        </div>
    </div>

    </form>
  {:else if state === 2}
    <article aria-busy="true">Generating Diagnosis...</article>
  {:else if state === 3}
    <article class="error">Sorry, something went wrong. Please try again.</article>
  {:else}

    <h1>Results: </h1>

    <article><small><b>Disclaimer:</b> The information provided on this website, including any diagnosis, potential treatments, and next steps, is intended for informational and educational purposes only and should not be considered professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional before making any decisions regarding your health or medical conditions. Never disregard, avoid, or delay seeking professional medical advice because of something you have read on this website. If you believe you are experiencing a medical emergency, call your local emergency number or seek immediate medical attention.</small></article>

    {#if comment}
        <article>{comment}</article>
    {/if}

    {#each diagnoses as diagnosis}
        <article>
            <h2>
                {diagnosis.diagnosis.title}
            </h2>
            <!-- <span>Likelihood: {diagnosis.diagnosis.likelihood_score}</span> -->
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

<div class="bottom-footer">
  <a href="#" on:click|preventDefault={() => modalOpen = true}>Terms of Use / Privacy Policy</a>
</div>

<dialog open={modalOpen}>
  <article>
    <div class="scroll-modal">
      <article class="warning"><small>This app is experimental and for educational purposes only. Use at your own risk.</small></article>

      <h3>Terms of Use</h3>

      <small>
        <p>By using this website, you acknowledge and agree that the website owners and operators, including their employees, agents, or partners, shall not be held responsible or liable for any consequences, direct or indirect, arising from the information provided on this website, including any diagnosis, potential treatments, and next steps.</p>
        <p>You understand that the information provided is for informational and educational purposes only and should not be considered professional medical advice, diagnosis, or treatment.</p>
        <p>You agree to seek the advice of a qualified healthcare professional for any health or medical concerns before making any decisions based on the information provided on this website.</p>
        <p>The website owners and operators disclaim all liability for any damages or losses, direct or indirect, that may result from your use of or reliance on the information provided on this website.</p>
      </small>
      <br/>
      <h3>Privacy Policy</h3>
      <small>
        <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our website. By using our website, you agree to the terms of this Privacy Policy.</p>
        <ol>
          <li><b>Information Collection and Use:</b><br>We collect and use the information you provide when you use our website, such as your name, age, sex, weight, height, occupation, lifestyle, and medical history, for the sole purpose of providing you with a preliminary health evaluation using our AI Doctor service. This information is only temporarily stored on our server during the processing of your request.</li>
          <li><b>Data Sharing with Third Parties:</b><br>In order to provide our AI Doctor service, we use the OpenAI API to process your personal information. By using our website, you agree to the processing of your data by OpenAI in accordance with their privacy policy. We do not share your personal information with any other third parties, except when required by law or to protect the rights, property, or safety of our users or the public.</li>
          <li><b>Data Retention:</b><br>Your personal information is only stored on our server for a temporary period during the processing of your AI Doctor request. Once the processing is complete, your personal information is promptly deleted from our server.</li> 
          <li><b>Security:</b><br>We are committed to ensuring the security of your personal information. We use appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security of your personal information.</li>
          <li><b>Children's Privacy:</b><br>Our website is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under the age of 13. If we become aware that a child under the age of 13 has provided us with personal information, we will take steps to delete such information from our records.</li>
          <li><b>Changes to this Privacy Policy:</b><br>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</li>
          <li><b>Contact Us:</b><br>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:calvin.hoenes@proton.me">calvin.hoenes@proton.me</a>.</li>
        </ol>
        <p>By using our website and providing your personal information, you acknowledge and agree to the terms of this Privacy Policy.</p>
      </small>
    </div>
    <footer>
      <small>By clicking on "Accept" you agree to the terms of this Privacy Policy and Terms of Use.</small>
      <a on:click|preventDefault={() => modalOpen = false} href="#" role="button">Accept</a>
    </footer>
  </article>
</dialog>