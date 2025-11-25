export default function StartPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children} {/* SIN HEADER NI FOOTER */}
      </body>
    </html>
  );
}

