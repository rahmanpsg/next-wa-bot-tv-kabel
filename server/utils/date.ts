import moment from "moment";

export const generateMonthsAndYears = (
  startDate: Date,
  endDate: Date = new Date()
) => {
  const momentStartDate = moment(startDate).add(1, "month");
  const momentEndDate = moment(endDate);

  const arrBulan = [];

  for (
    ;
    momentStartDate.isBefore(momentEndDate);
    momentStartDate.add(1, "months")
  ) {
    const bulan = momentStartDate.format("MM/YYYY");
    arrBulan.push(bulan);
  }

  return arrBulan;
};
