// get greeting depending on hour of the day
// Say either Good morning, Good afternoon or Good evening
export const getGreeting = () => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
};

export default getGreeting;
