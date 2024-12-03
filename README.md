This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Link Loom для показу функціоналу
https://www.loom.com/share/3b79d42a45d642cd9a46efa1426c1ff9?sid=25d1f68e-1500-420f-b3e6-34c84e4dc055

## Getting Started

First, run the development server:
Потрібно скачати всі бібліотеки і завантажити бібіліотеку, яка відображає pdf
```bash
npm i
npm run postinstall
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Структура проєкту, як і у більшості NextJs
/app
  /layout.tsx   Тут ми використовуємо sidebar, тому він буде працювати на всіх рівнях додатку
  /page.tsx   -> localhost:3000/
  /[id]/page.tsx --> Динамічна сторінка, на якій ми і працюємо.
  /_components/Sidebar.tsx -- Папка наших компонентів, потрібно _ щоб Nextjs не вважав це за сторінку і не створював route /_components
/hooks - допоміжні абстракції часто використовуємих хуків

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
