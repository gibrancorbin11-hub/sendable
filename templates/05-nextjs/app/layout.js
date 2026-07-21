export const metadata = {
  title: 'Sendable × Next.js',
  description: 'Lifecycle email through one function call.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
