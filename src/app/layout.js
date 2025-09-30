import Navbar from "../components/Navbar";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Eventify",
  description: "Book events with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
