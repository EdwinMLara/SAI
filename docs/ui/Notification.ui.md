# Notification Component

## Structure

- `message` (string): Text to display.
- `type` (optional): "success", "warning", "error", "info", "general".
- `show` (boolean): Whether to show the notification.
- `onClose` (function): Function to close it.

## How to use

```
<Notification show={true} message="Saved successfully" type="success" onClose={() => {}} />
```
