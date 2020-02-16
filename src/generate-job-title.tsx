let firstNameMap: { [key: string]: string };
let monthBornMap: Array<string>;

try {
  firstNameMap = JSON.parse(process.env.REACT_APP_FIRST_LETTER_ROLES || '');
} catch {
  console.error('Error parsing the First Letter Roles');
}

try {
  monthBornMap = JSON.parse(process.env.REACT_APP_MONTH_BORN_ROLES || '');
} catch {
  console.error('Error parsing the Month Born Roles');
}

export const generateJobTitle = (
  firstName?: string,
  industry?: string,
  monthBorn?: number
): string | null => {
  if (
    firstName &&
    industry &&
    (monthBorn !== undefined || monthBorn !== null)
  ) {
    const firstNameLetter = firstName.charAt(0).toUpperCase();
    if (
      firstNameMap[firstNameLetter] &&
      (monthBorn !== undefined || monthBorn !== null)
    ) {
      return `${firstNameMap[firstNameLetter]} ${industry} ${
        monthBornMap[monthBorn ?? 0]
      }`;
    }
  }

  return null;
};
