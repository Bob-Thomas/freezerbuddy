# Freezer Friend

A simple, offline mobile app for managing freezer inventory, with a strong focus on preventing users from forgetting ready-made meals.

## Features

- Track items in your freezer with photos and descriptions
- Set storage dates and expiry dates
- Add planned consumption dates with reminders
- Sort and filter items by various criteria
- Offline-first design with local storage
- No accounts or cloud storage required

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Ionic CLI
- Capacitor (for native features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/freezerfriend.git
cd freezerfriend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ionic serve
```

### Building for Production

To build the app for production:

```bash
ionic build
```

### Adding Native Platforms

To add native platforms (iOS/Android):

```bash
ionic capacitor add ios
ionic capacitor add android
```

## Development

### Project Structure

- `src/app/pages/` - Main application pages
- `src/app/services/` - Services for data management
- `src/app/models/` - Data models and interfaces
- `src/theme/` - Theme and styling files

### Key Components

- `InventoryPage` - Main list view of freezer items
- `AddItemPage` - Form for adding/editing items
- `ItemDetailsPage` - Detailed view of a single item
- `StorageService` - Handles local storage operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Ionic Framework and Angular
- Uses Capacitor for native features
- Inspired by the need to reduce food waste 