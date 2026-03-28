import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SuperSimpleSheet',
  description: 'A very simple table serving service. Create and fetch sheets in multiple formats easily.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
