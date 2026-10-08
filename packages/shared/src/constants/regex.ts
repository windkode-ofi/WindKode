/** Monto decimal positivo con hasta 2 decimales: `1500`, `1500.5`, `1500.50`. */
export const DECIMAL_AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/

/** Teléfono internacional laxo: dígitos, espacios, guiones y un `+` inicial opcional. */
export const PHONE_REGEX = /^\+?[\d\s-]{6,20}$/
