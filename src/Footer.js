import React from "react";

function Footer() {
  return (
    <footer className="text-white py-8 mt-8 border-t-blue-300 border-t-2">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Richard Lechko. All rights reserved.
        </p>
        <p className="text-sm">Built with ❤️ using React and GraphQL.</p>
      </div>
    </footer>
  );
}

export default Footer;
