export type ValentineContent = {
  question: {
    title: string;
    subtitle: string;
  };
  buttons: {
    yes: string;
    no: string;
  };
  escalationMessages: string[];
  loader: {
    title: string;
    steps: string[];
    result: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    finalMessage: string;
  };
  dateDetails: {
    targetDate: string;
    location: string;
    note: string;
  };
  afterCountdown?: {
    title: string;
    subtitle: string;
  };
};

