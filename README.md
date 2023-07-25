
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# NexShop - Next.js Ecommerce Website

NexShop is a modern and stylish ecommerce website built using Next.js, TypeScript, and Tailwind CSS. It also utilizes DaisyUI for Tailwind CSS components. The website provides a seamless shopping experience with a unique sign-in logic that allows users to transfer their anonymous cart items to their account cart upon signing in with Google API.

Visit the live website: [https://nexshop.vercel.app](https://nexshop.vercel.app)

## Features

- Browse and search for a wide range of products.
- Add products to your cart in anonymous mode.
- Sign in using Google API to sync your anonymous cart items to your account cart.

## Technologies Used

- Next.js: A powerful React framework for building server-side rendered and static websites.
- TypeScript: A typed superset of JavaScript that helps improve code quality and maintainability.
- Tailwind CSS: A utility-first CSS framework for building custom and responsive user interfaces.
- DaisyUI: A plugin for Tailwind CSS that provides additional components and styling options.

## Getting Started

To get a local copy of the NexShop project up and running, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Aminkbi/nexshop.git
cd nexshop
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

   - Create a `.env.local` file in the root directory.
   - Add the required environment variables (example):

   ```
   GOOGLE_CLIENT_ID=your_google_api_client_id
   ```

   Replace `your_google_api_client_id` with the Google API client ID you obtain from the Google Developer Console.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your web browser and visit [http://localhost:3000](http://localhost:3000) to see the NexShop website in action.

## Contributing

Contributions to NexShop are welcome! If you find any issues or have suggestions for improvement, please feel free to create a pull request or open an issue on the GitHub repository.

## License

The NexShop project is open-source and available under the [MIT License](LICENSE).

---

Happy shopping with NexShop! 🛍️
