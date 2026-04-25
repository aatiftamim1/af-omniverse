const EDITH_SECRET = '9999';
export function verifyEdith(passcode: string): boolean {
  return passcode === EDITH_SECRET;
}
