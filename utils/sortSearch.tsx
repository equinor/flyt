export const sortSearch = (values: string[], keyword: string) =>
  values.sort((a, b) => {
    const aVal = Math.abs(a.toLowerCase().indexOf(keyword.toLowerCase()));
    const bVal = Math.abs(b.toLowerCase().indexOf(keyword.toLowerCase()));
    return aVal - bVal;
  });
