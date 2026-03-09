import './globals.css';

export const metadata = {
  title: 'Qubit IQ',
  description: 'Ask anything. Get answers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}