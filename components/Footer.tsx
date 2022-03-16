export const Footer = () => {
  const tahun = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 bg-primary text-base-content">
      <div>
        <p>Copyright © {tahun} - Whatsapp Bot - TV Kabel</p>
      </div>
    </footer>
  );
};
