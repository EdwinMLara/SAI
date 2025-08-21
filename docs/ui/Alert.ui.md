# Alert Component

## Structure

- `open` (boolean): Whether the alert is visible.
- `icon` (optional, string): Icon name to display.
- `message` (string): The message to show.
- `actions` (array): List of buttons with label and action.
- `onClose` (function): Function to close the alert.

## How to use

```
<Alert
  open={true}
  icon="FaInfoCircle"
  message="Are you sure you want to continue?"
  actions={[{ label: 'Accept', onClick: () => alert('OK') }]}
  onClose={() => {}}
/>
```
