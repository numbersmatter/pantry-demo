export const dollarValueConverter = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const dollar = value * 0.01;

  return formatter.format(dollar);
};
