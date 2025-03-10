import dayjs from "dayjs";

export const getCurrentDate = () => {
  const startOfYear = dayjs().startOf("year");
  const endOfYear = dayjs().endOf("year");
  const today = dayjs();

  const totalDays = endOfYear.diff(startOfYear, "day") + 1;
  const passedDays = today.diff(startOfYear, "day") + 1;

  const progressPercentage = ((passedDays / totalDays) * 100).toFixed(1);

  return { passedDays, totalDays, progressPercentage };
};
