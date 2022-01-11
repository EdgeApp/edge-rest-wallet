export const checkCreateUser = (
  username?: string,
  password?: string,
  pin?: string
): void => {
  if (username == null) throw new Error('Username is required')
  if (password == null) throw new Error('Password is required')
  if (pin == null) throw new Error('PIN is required')
  if (pin.length !== 4 || isNaN(pin))
    throw new Error('PIN must be exactly 4 digit number')
}
