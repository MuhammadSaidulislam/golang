import imgExtension from "../Assets/Images/icon/feature-image.png";
import fileExtension from "../Assets/Images/icon/feature-file.png";
import videoExtension from "../Assets/Images/icon/feature-video.png";
import unknownExtension from "../Assets/Images/icon/feature-unknown.png";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';


export function convertBytesToSize(bytes: any) {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (bytes < kilobyte) {
    return bytes + ' Byte';
  } else if (bytes < megabyte) {
    return Math.round(bytes / kilobyte) + ' KB';
  } else if (bytes < gigabyte) {
    return Math.round(bytes / megabyte) + ' MB';
  } else {
    return Math.round(bytes / gigabyte) + ' GB';
  }
}

export const getFileType = (extension: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

  if (imageExtensions.includes(extension)) {
    return imgExtension;
  } else if (videoExtensions.includes(extension)) {
    return videoExtension;
  } else if (documentExtensions.includes(extension)) {
    return fileExtension;
  } else {
    return unknownExtension;
  }
};
// due date
export function getDueDateStatus(dueDateString: any) {
  const dueDate = new Date(dueDateString);
  const currentDate = new Date();

  // Zero out the hours, minutes, seconds, and milliseconds for accurate day comparison
  dueDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const difference = dueDate.getTime() - currentDate.getTime();
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (daysDifference < 0) {
    if (daysDifference === -1) {
      return 'Due Yesterday';
    } else {
      return `${Math.abs(daysDifference)} days ago`;
    }
  } else if (daysDifference === 0) {
    return 'Due Today';
  } else if (daysDifference === 1) {
    return 'Due Tomorrow';
  } else {
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}


export function separateComma(sharesString: any) {
  return sharesString.split(',').map((filename: any) => filename.trim());
}

export function maskEmail(email: string) {
  if (email) {
    const atIndex = email.indexOf('@');
    // Check if '@' is found in the email
    if (atIndex === -1) {
      console.error('Invalid email format: "@" not found');
      return email; // Return the original email if '@' is not found
    }

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);
    if (username.length >= 13) {
      const maskedUsername = username.substring(0, 10) + '...';
      return maskedUsername + domain;
    }
    return email;
  }


}

// chatting function

export const formattedDateForChatHeadWithCurrent = () => {
  const now = moment();

  // Format the date
  const formattedDate = now.format('dddd, MMMM Do');

  // Add the ordinal suffix manually
  const day = now.date();
  const ordinalSuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const finalFormattedDate = formattedDate.replace('Do', `${day}${ordinalSuffix}`);
  return finalFormattedDate;
}


export const fromNow = (date: any) => {
  const dateMoment = moment(date)
  const readable = dateMoment.fromNow()
  return readable
}


export const convertTimeToReadable = (date: any) => {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const dateObj = new Date(date);
  const timeString = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  // Check if the date is today
  if (dateObj.toDateString() === now.toDateString()) {
    return timeString;
  }
  // Check if the date is yesterday
  else if (dateObj.toDateString() === yesterday.toDateString()) {
    return `yesterday ${timeString}`;
  }
  // If the date is before yesterday
  else {
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const suffix = ['st', 'nd', 'rd', 'th'][((day % 10) - 1) % 10] || 'th';
    return `${day}${suffix}, ${month}, ${timeString}`;
  }
}

const getFirstName = (full_name: string) => {
  const first_name = full_name.split(" ")[0]
  return first_name
}

export const enhanceGroupUserName = (name: string) => {
  const names = name.split("&")
  const rest_names = names.slice(3)
  const main_name = `${getFirstName(names[1])},${getFirstName(names[2])}`
  if (rest_names.length === 0) return main_name
  else if (rest_names.length === 1) {
    const full_group_name = `${main_name} & ${getFirstName(rest_names[0])}`
    return full_group_name
  } else {
    const rest_users_number = rest_names.length
    const full_group_name = `${main_name} & ${rest_users_number} others`
    return full_group_name
  }
}

export const enhanceToGroupUserName = (name: string) => {
  return name.replace(/&/g, ' & ');

  //   const names = name.split("&")
  //   const rest_names = names.slice(2)
  //   const main_name = `${names[0]}, ${names[1]}`
  //   const rest_name = rest_names.reduce((acc, cur) => {
  //     return `${acc}, ${cur}`;
  //   });


  //   return main_name + " & " + rest_name
}

export const handleTodayClick = (setDueDate: any) => {
  setDueDate(new Date());
};

export const handleYesterdayClick = (setDueDate: any) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  setDueDate(yesterday);
};

export const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, setDueDate }: any) => (
  <div>
    <div className='calenderHeading'>
      <button className='arrowLeft' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><FontAwesomeIcon icon={faChevronLeft} /></button>
      <span className='calenderDate'>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      <button className='arrowRight' onClick={increaseMonth} disabled={nextMonthButtonDisabled}><FontAwesomeIcon icon={faChevronRight} /></button>
    </div>
    <div className='calenderBtn'>
      <button onClick={() => handleYesterdayClick(setDueDate)}>Yesterday</button>
      <button onClick={() => handleTodayClick(setDueDate)}>Today</button>
    </div>
  </div>
);

// pagination divided
export function multiplyBySixAndShowSeries(originalValue: any) {
  const thresholds = [10, 25, 100, 200, 500, 1000];
  const resultArray = [];
  for (const threshold of thresholds) {
    resultArray.push(threshold);
    if (originalValue < threshold) {
      break;
    }
  }
  return resultArray;
}

export function paginationNumber(total: any, limit: any) {
  const divisions = Math.ceil(total / limit);
  const resultArray = [];
  for (let i = 1; i <= divisions; i++) {
    resultArray.push(i);
  }
  return resultArray;
}

export const messageFormatDate = (dateString: string) => {
  const inputDate: any = new Date(dateString);
  const today: any = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Helper function to check if two dates are the same day
  const isSameDay = (d1: any, d2: any) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(inputDate, today)) {
    return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (isSameDay(inputDate, yesterday)) {
    return 'Yesterday';
  }

  const daysDifference: any = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));

  if (daysDifference >= 2 && daysDifference <= 7) {
    return daysOfWeek[inputDate.getDay()];
  }

  return inputDate.toLocaleDateString();
};


export function invoiceFormatTimes(timestamp: string) {
  // Parse the input timestamp
  const date = new Date(timestamp);

  // Define arrays for month names and AM/PM
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  // Get the components of the date
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Convert 24-hour time to 12-hour time
  let hours = date.getHours() % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format the date and time
  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;

  return formattedDate;
}


export function formatResourceDate(dateString: string) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}

const timeOptions = [
  { value: 1, label: '1 AM' },
  { value: 2, label: '2 AM' },
  { value: 3, label: '3 AM' },
  { value: 4, label: '4 AM' },
  { value: 5, label: '5 AM' },
  { value: 6, label: '6 AM' },
  { value: 7, label: '7 AM' },
  { value: 8, label: '8 AM' },
  { value: 9, label: '9 AM' },
  { value: 10, label: '10 AM' },
  { value: 11, label: '11 AM' },
  { value: 12, label: '12 PM' },
  { value: 13, label: '1 PM' },
  { value: 14, label: '2 PM' },
  { value: 15, label: '3 PM' },
  { value: 16, label: '4 PM' },
  { value: 17, label: '5 PM' },
  { value: 18, label: '6 PM' },
  { value: 19, label: '7 PM' },
  { value: 20, label: '8 PM' },
  { value: 21, label: '9 PM' },
  { value: 22, label: '10 PM' },
  { value: 23, label: '11 PM' },
  { value: 24, label: '12 AM' }
];
function getTimeValue(timeString: any) {
  const time = timeString.trim().toUpperCase();
  const isPM = time.includes('PM');
  const hour = parseInt(time.match(/\d+/)[0], 10);
  if (hour === 12) {
    return isPM ? 12 : 0;
  } else {
    return isPM ? hour + 12 : hour;
  }
}

export function findTimeGap(startTime: any, endTime: any) {
  const startTimeValue = getTimeValue(startTime);
  const endTimeValue = getTimeValue(endTime);
  const startIndex = timeOptions.findIndex((option: any) => option.value === startTimeValue);
  const endIndex = timeOptions.findIndex((option: any) => option.value === endTimeValue);

  let gap = 0;
  if (endIndex >= startIndex) {
    gap = endIndex - startIndex;
  } else {
    gap = (endIndex + timeOptions.length) - startIndex;
  }

  return gap;
}

export const truncateString = (str: string, maxLength: number = 35): string => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
};