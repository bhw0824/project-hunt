import './styles.css';

export const metadata = {
  title: 'Project Hunt',
  description: 'Daily project lead tracker for fiber, broadband, utilities, and make-ready work.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
