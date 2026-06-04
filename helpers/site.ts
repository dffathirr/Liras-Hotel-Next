export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const formatNumber = (
  number: string | number,
  replaceTo: string | null = ",",
) => {
  let formattedNumber = new Intl.NumberFormat("id-ID", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(number));

  if (replaceTo) {
    formattedNumber = formattedNumber.replace(/[,.]/g, replaceTo);
  }

  return formattedNumber;
};
