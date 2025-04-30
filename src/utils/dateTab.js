import {
    format,
    subDays,
    subYears,
    subMonths,
    addDays,
    addYears,
    addMonths,
    parseISO,
    isWithinInterval,
  } from "date-fns";
  
  export const filterDataByDateTab = (data, dateTab, dateOffset = 0) => {
    const today = new Date();
    let startDate, endDate;
  
    switch (dateTab) {
      case "day":
        startDate = subDays(today, dateOffset);
        endDate = subDays(today, dateOffset);
        break;
      case "week":
        startDate = subDays(today, 7 * dateOffset); 
        endDate = subDays(today, 6 + 7 * dateOffset); 
        break;
      case "month":
        startDate = subDays(today, 30 * dateOffset);
        endDate = subDays(today, 29 + 30 * dateOffset);
        break;
      case "year":
        startDate = subYears(today, dateOffset);
        endDate = subYears(today, dateOffset + 1); 
        break;
      default:
        console.log("No filter applied");
        return data;
    }
  
    const startFormatted = format(startDate, "yyyy-MM-dd");
    const endFormatted = format(endDate, "yyyy-MM-dd");
  
    return data.filter((item) => {
      return isWithinInterval(parseISO(item.date), {
        start: parseISO(endFormatted),
        end: parseISO(startFormatted),
      });
    });
  };
  