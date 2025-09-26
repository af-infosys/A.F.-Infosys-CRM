export default function toGujaratiNumber(num) {
  // English to Gujarati digit mapping
  const gujaratiDigits = {
    0: "૦",
    1: "૧",
    2: "૨",
    3: "૩",
    4: "૪",
    5: "૫",
    6: "૬",
    7: "૭",
    8: "૮",
    9: "૯",
  };

  // Convert number to string, then map each digit
  return String(num)
    .split("")
    .map((digit) => gujaratiDigits[digit] || digit) // keep non-numeric as is
    .join("");
}
