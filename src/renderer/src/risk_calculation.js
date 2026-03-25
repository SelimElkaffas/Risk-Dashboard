// Taken from Supplemental Table S12A 
const BETA_COEFFS = {
  women: {
    age: 0.7939329,
    nonHdl: 0.0305239,
    hdl: -0.1606857,
    sbpUnder110: -0.2394003,
    sbpOver110: 0.3600781,
    diabetes: 0.8667604,
    smoker: 0.5360739,
    statin: -0.1477655,
    Antihtn: 0.3151672,
    constant: -3.307728,
    age_nonHdl: -0.0819715,
    age_hdl: 0.0306769,
    age_sbpOver110: -0.0946348,
    age_diabetes: -0.27057,
    age_smoker: -0.078715
  },
  men: {
    age: 0.7688528,
    nonHdl: 0.0736174,
    hdl: -0.0954431,
    sbpUnder110: -0.4347345,
    sbpOver110: 0.3362658,
    diabetes: 0.7692857,
    smoker: 0.4386871,
    statin: -0.1337349,
    Antihtn: 0.288879,
    constant: -3.031168,
    age_nonHdl: -0.0517874,
    age_hdl: 0.0191169,
    age_sbpOver110: -0.1049477,
    age_diabetes: -0.2251948,
    age_smoker: -0.0895067
  }
};

const MGDL_TO_MMOL = 0.02586;

export const calculateRisk = (patient) => {
    const { age, sex, tChol, hdl, sbp, diabetes, smoker, usingAntihtn, usingStatin } = patient;

    const c = sex === 'female' ? BETA_COEFFS.women : BETA_COEFFS.men;

    const ageScaled = (age - 55) / 10;

    const nonHdlMmol = (tChol - hdl) * MGDL_TO_MMOL;
    const hdlMmol = hdl * MGDL_TO_MMOL;

    const nonHdlScaled = nonHdlMmol - 3.5;
    const hdlScaled = (hdlMmol - 1.3)/ 0.3;

    const sbpUnder110Scaled = (Math.min(sbp, 110) - 110) / 20;
    const sbpOver110Scaled = (Math.max(sbp, 110) - 130) / 20;

    let L = c.constant + 
          (c.age * ageScaled) + 
          (c.nonHdl * nonHdlScaled) +  (c.age_nonHdl * ageScaled * nonHdlScaled) + 
          (c.hdl * hdlScaled) + (c.age_hdl * ageScaled * hdlScaled) + 
          (c.sbpUnder110 * sbpUnder110Scaled) +
          (c.sbpOver110 * sbpOver110Scaled) + (c.age_sbpOver110 * ageScaled * sbpOver110Scaled);

    if (diabetes) L += c.diabetes + (c.age_diabetes * ageScaled * 1);
    if (smoker) L += c.smoker + (c.age_smoker * ageScaled * 1);
    if (usingAntihtn) L += c.Antihtn; 
    if (usingStatin) L += c.statin;

    const probability = 1 / (1 + Math.exp(-L));
    const riskPercentage = probability * 100;

    return riskPercentage.toFixed(2);
}