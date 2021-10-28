export function getSocketStatusText(
  socketConnected: boolean,
  socketReason?: string
) {
  if (socketConnected) {
    return "Connection is looking good!\nYour changes should appear immediately for other users.";
  } else if (socketReason) {
    return `You are not connected because of ${socketReason}.`;
  }
  return `You are not connected.`;
}
