# Ynab —— You Need A Budget!!

![ynab](https://socialify.git.ci/mrExplorist/ynab/image?description=1&font=Inter&language=1&logo=https%3A%2F%2Fe7.pngegg.com%2Fpngimages%2F692%2F999%2Fpng-clipart-health-insurance-health-care-finance-health-blue-angle-thumbnail.png&name=1&owner=1&pattern=Solid&stargazers=1&theme=Light)

Ynab is a personal finance app designed to help you manage your money better by budgeting upwards and maintaining financial discipline. This application allows you to track your income and expenses, set a default currency for transactions, create and manage categories, and view transaction history within a specified date range.

## Features

- **Transaction Management**: Add, edit, and delete transactions with ease. View your transaction history filtered by date range.
- **Budgeting**: Categorize your income and expenses to maintain a disciplined budget. Create custom categories for better organization.
- **Currency Settings**: Set and manage your default currency for all transactions.
- **Date Range Picker**: Easily select and view transactions within a specific date range.
- **Data Export**: Export your transaction history to CSV format for offline access and analysis.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm(v8 or higher) or npm (v6 or higher) or Yarn (v1.22 or higher)
- PostgreSQL (or any other SQL database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ynab.git
   cd ynab
   ```

2. Install dependencies:

   ```bash
   pnpm install
    # or
   npm install
   # or
   yarn install
   ```

3. Set up the environment variables. Create a `.env` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   ```

4. SQlite prisma settings

   ```bash
   provider = "sqlite"
   DATABASE_URL="file:./dev.db"
   ```

5. Run the database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

7. Open your browser and navigate to `http://localhost:3000`.

### Deployment

For deploying the app to production, follow the documentation of your preferred hosting service (Vercel, Netlify, Heroku, etc.). Make sure to set the necessary environment variables in your hosting service's dashboard.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [date-fns](https://date-fns.org/)
- [Clerk](https://clerk.dev/)
- [Shadcn](https://shadcn.com/)

## Contact

For any inquiries or feedback, please contact us at mailfor.lalitsharma@gmail.com.

---

Happy Budgeting! 🚀
