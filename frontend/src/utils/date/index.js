import moment from "moment";

export const timeAgo = (createdAt) => {
  const now = moment();
  const date = moment(createdAt);
  const duration = moment.duration(now.diff(date));

  // Eğer 1 gün geçmemişse dakika cinsinden
  if (duration.days() === 0) {
    if (duration.hours() === 0) {
      return `${duration.minutes()}m`; // dakika
    } else {
      return `${duration.hours()}h`; // saat
    }
  }

  // Eğer 1 günden fazla ancak 1 haftadan azsa gün cinsinden
  if (duration.days() > 0 && duration.days() < 7) {
    return `${duration.days()}d`; // gün
  }

  // Eğer 1 haftadan fazla ise hafta cinsinden
  if (duration.days() >= 7) {
    return `${Math.floor(duration.asWeeks())}w`; // hafta
  }
};

export const joinedDate = (createdAt) => {
  const date = new Date(createdAt); // Gelen tarihi Date objesine dönüştür
  const options = { year: "numeric", month: "long" }; // İstediğimiz formatı ayarla
  return date.toLocaleDateString("en-US", options);
};
