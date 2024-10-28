import { useState } from "react";

export const useFormSteps = () => {
  const [step, setStep] = useState(0);

  const incStep = () => setStep(step + 1);
  const decStep = () => setStep(step - 1);

  return { step, incStep, decStep };
};
