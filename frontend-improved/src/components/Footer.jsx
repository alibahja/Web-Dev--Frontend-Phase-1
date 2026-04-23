const Footer = ({ darkMode }) => {
  return (
    <div
      className={`w-full py-6 border-t mt-10 ${
        darkMode
          ? 'bg-[#0A0F1F] border-[#2D3748] text-[#A0AEC0]'
          : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>&copy; 2026 Library. All rights reserved.</p>

        <ul className="flex gap-6">
          <li className="cursor-pointer hover:text-[#5F7DB0] transition-colors">
            Terms of Services
          </li>
          <li className="cursor-pointer hover:text-[#5F7DB0] transition-colors">
            Privacy Policy
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;